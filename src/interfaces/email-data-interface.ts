export interface IAttachment {
  filename: string;
  content: string;
  encoding: string;
  contentType: string;
}

export interface EmailData {
  templateName: string;
  to: string;
  data: any;
  language: string;
  from?: string;
  bcc?: string[];
  cc?: string[];
  attachments?: IAttachment[];
}
