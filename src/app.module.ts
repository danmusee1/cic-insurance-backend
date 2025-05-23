import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './shared/helpers/env.helpers';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
import { GoogleModule } from './googleAuth/google.module';
import { UserService } from './user/user.service';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
@Module({
  imports: [ 
    MulterModule.register({
      dest: './uploads', // Specify the destination folder to store the uploaded files
    }),
    ConfigModule.forRoot({ 
      envFilePath,
       isGlobal: true
       }),
  UserModule,
  AuthModule,
  MessageModule,
  GoogleModule
  ],
        
  controllers: [AppController],
  providers: [AppService,PrismaService,UserService],
})
export class AppModule {}
