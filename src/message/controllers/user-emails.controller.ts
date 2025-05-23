/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
    Controller,
    HttpCode,
    Response,
    Post,
    Get,
    Body,
    UseGuards,
    UseFilters,
    Req,
  } from '@nestjs/common';
  import { CommonService } from 'src/shared/services/common.service';
  import { PrismaService } from 'src/prisma/prisma.service';
  import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MessageNodemailerService } from './message-nodemailer.service';
  @Controller('user')
  export class UserEmailsController {
    constructor(
      private prismaService: PrismaService,
      private commonService: CommonService,
      private messageService: MessageNodemailerService,
      private readonly jwtService: JwtService,
    ) {}
   /*  ihlk ooei odsn egaw */
  
   @Post('registration-message')
   @HttpCode(200)
   async sendEmail(@Body('userEmail') email: string): Promise<{ message: string }> {
     try {
       const templateName = "confirmation";
       /* const token = Math.floor(1000 + Math.random() * 9000).toString(); */
    
       /* const token = this.jwtService.sign({ email }, {
        secret: process.env.APP_KEY,
        expiresIn: 3600,
        algorithm: 'HS512',
      });
      console.log(token); */
       await this.messageService.sendUserConfirmation(email,templateName);
       return this.commonService.returnFormattedResponse(200, `Email sent successfully to ${email}`, email);

     } catch (error) {
       // Handle error here
       throw error;
     }
   }



   @Post('forget-password-message')
   @HttpCode(200)
   async sendForgetPasswordEmail(@Body('userEmail') email: string): Promise<{ message: string }> {
     try {
       const templateName = "resetpassword";
       /* const token = Math.floor(1000 + Math.random() * 9000).toString(); */
    
       const token = this.jwtService.sign({ email }, {
        secret: process.env.APP_KEY,
        expiresIn: 3600,
        algorithm: 'HS512',
      });
      console.log(token);
       await this.messageService.sendUserResetPassword(email,templateName, token);
       return this.commonService.returnFormattedResponse(200, `Resset Password Email sent successfully to ${email}`, email);

     } catch (error) {
       // Handle error here
       throw error;
     }
   }
  
   /*  @Post('forget-password-message')
    @HttpCode(200)
    @UseFilters(new HttpExceptionFilter())
    async forgetPassword(
      @Body('userEmail') userEmail: string,
    ): Promise<{ message: string }> {
      try {
        const templateName = "passwordResetEmail";
        await this.messageService.sendMessage(userEmail,templateName);
        return { message: 'Email sent successfully.' };
      } catch (error) {
        // Handle error here
        throw error;
      }
    }
  
   */
    

  
  
  
  
  
  
  
  }
  