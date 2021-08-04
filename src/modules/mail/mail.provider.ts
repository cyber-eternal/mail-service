import { Injectable } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { AMQPController } from '@app/lib/amqp/amqp.controller';
import { MailService } from './mail.service';
import { Exchange } from '@app/lib/amqp/exchange.enum';
import { EmailData } from '@app/interfaces/email-data-interface';

@Injectable()
export class MailProvider extends AMQPController {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {
    super(
      configService.get('amqp').connectionString,
      configService.get('amqp').emailQueueName,
      Exchange.mailExchange,
      configService.get('amqp').queuePrefix,
    );
  }

  async handleMessage(payload: EmailData): Promise<void> {
    this.mailService.sendMail(payload);
  }
}
