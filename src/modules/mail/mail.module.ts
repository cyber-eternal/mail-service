import { Module } from '@nestjs/common';
import { MailProvider } from './mail.provider';
import { MailService } from './mail.service';

@Module({
  providers: [MailService, MailProvider],
  exports: [MailService],
})
export class MailModule {}
