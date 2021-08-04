import { IAttachment } from '@app/interfaces/email-data-interface';
import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  readonly templateName: string;

  @IsString()
  @IsNotEmpty()
  readonly to: string;

  @IsString()
  @IsNotEmpty()
  readonly language: string;

  @IsNotEmptyObject()
  readonly data: string;

  @IsOptional()
  @IsArray()
  readonly bcc?: string[];

  @IsOptional()
  @IsArray()
  readonly cc?: string[];

  @IsOptional()
  @IsString()
  readonly from?: string;

  @IsOptional()
  @IsArray()
  readonly attachments?: IAttachment[];

  constructor(message: MessageDto) {
    this.templateName = message.templateName;
    this.to = message.to;
    this.from = message.from;
    this.data = message.data;
    this.language = message.language;
    this.bcc = message.bcc;
    this.cc = message.cc;
    this.attachments = message.attachments;
  }
}
