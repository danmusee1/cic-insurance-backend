import {
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Body,
  Param,
  Res,
  Get,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommonService } from 'src/shared/services/common.service';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(
    private commonService: CommonService,
    private readonly jwtService: JwtService,
  ) { }
  /*  @Post('login')
   @HttpCode(200)
   async login(@Body() data: any): Promise<any> {
     console.log('Here');
     const user = await this.commonService.getUserByEmail(data.email);
     if (
       user &&
       (await this.commonService.validatePassword(data.password, user.password))
     ) {
       let payload: any = {
         sub: user.email,
         id: user.id,
         name: user.firstName + ' ' + user.lastName,
         email: user.email,
         role: user.role,
         firstName: user.firstName,
         lastName: user.lastName,
         affiliateId:user.affiliateId,
         affiliatedBy:user.affiliatedBy,
         phoneNumber:user.phoneNumber
       };
       console.log("the payload received",payload)
       payload.jwt = this.jwtService.sign(payload, {
         secret: process.env.APP_KEY,
         expiresIn: 3600,
         algorithm: 'HS512',
       });
       return this.commonService.returnFormattedResponse(
         200,
         'Successfully Logged In',
         payload,
       );
     } else {
       return this.commonService.returnFormattedResponse(
         401,
         'Wrong username or password.Perherps you signedup with a social account?',
         {},
       );
     }
     //  return response.status(200).send('This action returns data from ABC Controller Library Approach')
   } */

  @Post('login')
  @HttpCode(200)
  async login(@Body() data: any): Promise<any> {
    try {
      console.log('Login endpoint hit with data:', data);

      // Ensure data is an object and parse if necessary
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      // Validate email presence
      if (!data.email) {
        return this.commonService.returnFormattedResponse(
          400,
          'Email is required for login.',
          {}
        );
      }

      // Fetch user by email
      const user = await this.commonService.getUserByEmail(data.email);
      if (
        user &&
        (await this.commonService.validatePassword(data.password, user.password))
      ) {
        // Construct JWT payload
        const payload: any = {
          sub: user.email,
          id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        };

        console.log('Payload before signing JWT:', payload);

        // Sign the JWT
        payload.jwt = this.jwtService.sign(payload, {
          secret: process.env.APP_KEY,
          expiresIn: '1h',
          algorithm: 'HS512',
        });

        console.log('Response payload:', payload);

        return this.commonService.returnFormattedResponse(
          200,
          'Successfully Logged In',
          payload,
        );
      } else {
        console.warn(`Authentication failed for email: ${data.email}`);
        return this.commonService.returnFormattedResponse(
          401,
          'Wrong username or password. Perhaps you signed up with a social account?',
          {}
        );
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      return this.commonService.returnFormattedResponse(
        500,
        'An error occurred during login. Please try again later.',
        {}
      );
    }
  }









}
