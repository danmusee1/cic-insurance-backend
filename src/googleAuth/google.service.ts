/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/shared/services/common.service';
@Injectable()
export class GoogleService {
  constructor( private commonService: CommonService,){}
  getHello(): string {
    return 'Hello World!';
  }
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }
    return this.commonService.returnFormattedResponse(200, 'User information from google', req.user);
    /* return {
      message: 'User information from google',
      user: req.user
    } */
  }
 
}
