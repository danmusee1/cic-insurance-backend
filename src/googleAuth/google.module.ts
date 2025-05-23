import { SharedModule } from 'src/shared/shared.module';
import { MulterModule } from '@nestjs/platform-express';
import { Module } from '@nestjs/common';
import { GoogleController } from './controller/google.controller';
import { GoogleService } from './google.service';
import { AuthController } from 'src/auth/auth/auth.controller';
import { GoogleStrategy } from './google.strategy';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    SharedModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  exports: [],
  providers: [GoogleService,AuthController,GoogleStrategy,UserService],
  controllers: [GoogleController],
})
export class GoogleModule {}
