import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';


@Injectable()
export class MessageNodemailerService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string,templateName:string) {
   // const url = `${process.env.NEXTAUTH_URL}/sign-up/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email, // Pass the email address directly
      subject: 'Welcome to CIC insurance', // Subject line
      template: templateName,
      context: { 
        name: email,
      },
      /* text: `Hello, please confirm your email by visiting: ${url}`, // Plain text body
      html: `<p>Hello,</p><p>Please confirm your email by visiting: <a href="${url}">${url}</a></p>`, // HTML body */
    });
  }
  async sendUserNewsLetter(email: string,templateName:string) {
  
    const url = `${process.env.NEXTAUTH_URL}`;
    await this.mailerService.sendMail({
      to: email, // Pass the email address directly
      subject: 'Welcome to our platform!', // Subject line
      template: templateName,
      context: { 
        name: email,
        url,
      },
      /* text: `Hello, please confirm your email by visiting: ${url}`, // Plain text body
      html: `<p>Hello,</p><p>Please confirm your email by visiting: <a href="${url}">${url}</a></p>`, // HTML body */
    });
  }

  async sendUserResetPassword(email: string,templateName:string, token: string,) {
    const url = `${process.env.NEXTAUTH_URL}/forget-password/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email, // Pass the email address directly
      subject: 'Reset your Password!', // Subject line
      template: templateName,
      context: { 
        name: email,
        url,
      },
      /* text: `Hello, please confirm your email by visiting: ${url}`, // Plain text body
      html: `<p>Hello,</p><p>Please confirm your email by visiting: <a href="${url}">${url}</a></p>`, // HTML body */
    });
  }
}
