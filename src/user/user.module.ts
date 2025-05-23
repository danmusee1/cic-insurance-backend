import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonService } from 'src/shared/services/common.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.APP_KEY,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [UserController],
  providers: [PrismaService, CommonService, JwtService],
  exports: [PrismaService, CommonService, JwtService],
})
export class UserModule {}
