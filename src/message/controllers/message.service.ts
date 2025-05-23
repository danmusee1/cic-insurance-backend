import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class MessageService {
  private emailTemplates: { [key: string]: { subject: string, text: string } };

  constructor(private readonly configService: ConfigService) {
  
  }


  async sendMessage(to: string, templateName: string): Promise<void> {
    if (!this.emailTemplates.hasOwnProperty(templateName)) {
      throw new Error(`Template '${templateName}' not found.`);
    }

    const { subject, text } = this.emailTemplates[templateName];
    const msg = {
      to,
      from: 'mozne2r@gmail.com',
      subject,
      text,
    };
  
    try {
      console.log('Email sent:', msg);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
