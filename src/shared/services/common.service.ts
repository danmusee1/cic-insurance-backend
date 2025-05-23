/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommonService {
  constructor(private prismaService: PrismaService) {}
async hashPassword(plainPassword: string): Promise<string> {
  if (!plainPassword) {
    throw new Error('Password is required for hashing');
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(plainPassword, salt);
  return hash;
}

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }

 
 async getUserByEmail(email: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
  returnFormattedResponse(code: number, message: string, data: any): any {
    return {
      response: { code, message },
      data: data,
    };
  }


}
