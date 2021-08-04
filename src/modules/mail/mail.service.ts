import Email from 'email-templates';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { EmailData } from '@app/interfaces/email-data-interface';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transport: any;
  private readonly defaultTemplateName: string = 'default';
  private templatesPath = path.resolve(process.cwd(), 'templates');

  constructor(private readonly configService: ConfigService) {
    this.transport = nodemailer.createTransport(configService.get('mail').smtp);
  }

  public sendMail(emailData: EmailData) {
    this.logger.debug(
      `Trying to send email: ${JSON.stringify({
        ...emailData,
        attachments: emailData.attachments?.length || 0,
      })}`,
    );

    const sendEmail = new Email({
      message: {
        from: emailData.from ?? this.configService.get('mail').defaultSender,
        bcc: emailData.bcc || [],
        cc: emailData.cc || [],
        attachments: emailData.attachments || [],
      },
      send: true,
      transport: this.transport,
      views: {
        root: this.templatesPath,
        options: {
          extension: 'njk',
        },
      },
    });

    let templatePath = path.join(this.templatesPath, emailData.templateName);

    if (!fs.existsSync(templatePath)) {
      this.logger.warn(`Template "${templatePath}" doesn't exist`);

      // Use the default template
      templatePath = path.join(this.templatesPath, this.defaultTemplateName);
    }

    sendEmail
      .send({
        template: templatePath,
        message: {
          to: emailData.to,
          bcc: emailData.bcc || [],
          cc: emailData.cc || [],
          attachments: emailData.attachments || [],
        },
        locals: emailData.data,
      })
      .then(() => {
        const address = emailData.to.split('@').pop();

        this.logger.log(`Email sent to ...@${address}`);
      })
      .catch((e: Error) => this.logger.error(e.message));
  }
}
