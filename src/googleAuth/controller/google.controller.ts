/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GoogleService } from '../google.service';
import { AuthController } from 'src/auth/auth/auth.controller';
import { ConfigService } from '@nestjs/config';

@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private authService: AuthController,
    private readonly configService: ConfigService
  ) {}



  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const redirectTo = req.query.redirectTo || '/dashboard'; // Default to /home if not provided
  
    try {
      const response = await this.googleService.googleLogin(req);
  
      if (!response || !response.response) {
        console.error('Invalid response received');
        return res.redirect(`${process.env.NEXTAUTH_URL}/?redirectTo=${encodeURIComponent(redirectTo)}`);
      }
  
      if (response.response.code === 200) {
        const signInResponse = await this.authService.login({
          email: response.data.email,
          password: this.configService.get<string>('SECURE_GOOGLEAUTH_PASSWORD') || 'Admin@123',
        });
  
        if (signInResponse.response.code === 200) {
          const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
          res.cookie('userData', signInResponse.data.jwt, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: MAX_AGE,
            path: '/',
          });
  
          // Redirect to `redirectTo` if provided
          return res.redirect(`${process.env.NEXTAUTH_URL}/?redirectTo=${encodeURIComponent(redirectTo)}`);
        } else {
          return res.redirect(`${process.env.NEXTAUTH_URL}/?redirectTo=${encodeURIComponent(redirectTo)}`);
        }
      } else {
        return res.redirect(`${process.env.NEXTAUTH_URL}/?redirectTo=${encodeURIComponent(redirectTo)}`);
      }
    } catch (error) {
      console.error('Google Auth Redirect Error:', error);
      return res.redirect(`${process.env.NEXTAUTH_URL}/?redirectTo=${encodeURIComponent(redirectTo)}`);
    }
  }
  

}
