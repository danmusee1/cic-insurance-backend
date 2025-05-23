/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, Post, UseFilters } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { HttpExceptionFilter } from "src/shared/filters/http-excetion.filters";
import { CommonService } from "src/shared/services/common.service";

@Controller("user")
export class UserController{
    constructor(
    private prismaService:PrismaService,
    private commonService:CommonService
    ){}

@Post('register')
@HttpCode(200)
@UseFilters(new HttpExceptionFilter())
async registerUser(@Body() userData: any): Promise<any> {
  try {
    console.log('User Data:', userData);
    const hashedPassword = await this.commonService.hashPassword(userData.password);

    const user = await this.prismaService.user.create({
      data: {
          username: userData.firstName + ' ' + userData.lastName,
         firstName: userData.firstName,
         lastName: userData.lastName,
        middleName: userData.middleName,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        address: userData.address,
        password: hashedPassword,
      },
    });

    if (user) {
      // Destructure password and remove it from the response
      const { password, ...safeUser } = user;
      return this.commonService.returnFormattedResponse(200, 'okay', safeUser);
    } else {
      return this.commonService.returnFormattedResponse(405, 'Ooops, something went wrong', {});
    }
  } catch (error) {
    // Log actual error for debugging
    console.error('Register Error:', error);

    return this.commonService.returnFormattedResponse(500, 'Internal Server Error', {});
  }
}



}
