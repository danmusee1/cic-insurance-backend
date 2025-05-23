import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CommonService } from './services/common.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.APP_KEY,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [],
  providers: [PrismaService, CommonService, JwtService],
  exports: [PrismaService, CommonService, JwtService],
})
export class SharedModule {}
