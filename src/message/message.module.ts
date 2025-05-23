/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { MessageNodemailerService } from './controllers/message-nodemailer.service';
import { UserEmailsController } from './controllers/user-emails.controller';
import { MessageService } from './controllers/message.service';
@Global() 
@Module({
  imports: [
    SharedModule,
    MailerModule.forRootAsync({
      // imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => ({
        // transport: config.get("MAIL_TRANSPORT"),
        // or
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(process.cwd(), 'mail', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),

  ],
  providers: [MessageService,MessageNodemailerService],
  exports: [MessageService,MessageNodemailerService],
  controllers: [UserEmailsController],
})
export class MessageModule {}
