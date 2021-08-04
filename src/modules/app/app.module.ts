import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from 'nestjs-config';
import { MailModule } from 'src/modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.load(
      path.resolve(process.cwd(), 'config', '**/!(*.d).{ts,js}'),
    ),
    MailModule,
  ],
})
export class AppModule {}
