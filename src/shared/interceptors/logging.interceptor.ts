/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';

export interface Response<T> {
  data: T;
}

@Injectable()
export class LoggingInterceptor <T> implements NestInterceptor<T, Response<T>>  {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const jwtService = new JwtService();
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    // console.log('-----------------Request');
    // console.log(request.headers);
    // console.log(request.body);
    const headers = request.headers;
    if(headers['authorization']){
      request.body.identity= jwtService.decode(headers['authorization'].split(' ')[1]);
    }
    const responseStream = next.handle();
    return responseStream.pipe(map((data) => {
      console.log('++++++++++++++++++ Response +++',data);
      console.log(`Request took... ${Date.now() - now}ms`)
      return data 
    }));
  }

  getUserInstance(jwt: string): any {

  }
}