export interface Attachment {
  content: string | Buffer;
  filename: string;
  type: string;
  disposition?: string;
  encoding: string;
}

export class SendEmailArgs {
  from?: string;
  to: string | string[];
  subject: string;
  content: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Attachment[];
}
