import { Body, Controller, HttpCode, Post, UseFilters } from "@nestjs/common";
import { MessageNodemailerService } from "src/message/controllers/message-nodemailer.service";
import { PrismaService } from "src/prisma/prisma.service";
import { HttpExceptionFilter } from "src/shared/filters/http-excetion.filters";
import { CommonService } from "src/shared/services/common.service";

@Controller("user")
export class UserController{
    constructor(
    private prismaService:PrismaService,
    private commonService:CommonService,
    private messageService: MessageNodemailerService,
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
      const templateName = "confirmation";
    if (user) {
      // Destructure password and remove it from the response
      const { password, ...safeUser } = user;
      await this.messageService.sendUserConfirmation(safeUser.email,templateName);
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

  @Post('forget-password')
@HttpCode(200)
@UseFilters(new HttpExceptionFilter())
async forgetPassword(
  @Body() resetData: { email: string; password: string }
): Promise<any> {
  try {
    const { email, password } = resetData;

    // Find the user by email
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      return this.commonService.returnFormattedResponse(
        404,
        'User not found',
        {}
      );
    }

    // Hash the new password
    const hashedPassword = await this.commonService.hashPassword(password);

    // Update the user's password
    await this.prismaService.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return this.commonService.returnFormattedResponse(
      200,
      'Password reset successfully',
      {}
    );
  } catch (error) {
    console.error(error);
    return this.commonService.returnFormattedResponse(
      500,
      'An error occurred while resetting the password',
      {}
    );
  }
}

@Post('list')
@HttpCode(200)
@UseFilters(new HttpExceptionFilter())
async findAllUsers(@Body() payload:any): Promise<any>{
        try{
 const data = await this.prismaService.user.findMany({
            select: {
              id: true,
             firstName: true,
        lastName: true,
        middleName: true,
        phoneNumber: true,
        address:true,
              email:true,
              createdAt: true,
             
            },
 orderBy: { createdAt: "desc" },
        })
         if (data) {
                  return this.commonService.returnFormattedResponse(200, 'List retrieved successfully', data);
    } else {
      return this.commonService.returnFormattedResponse(405, 'Ooops, something went wrong', {});
    }

    }catch (error) {
          return this.commonService.returnFormattedResponse(500, 'Internal Server Error', {error});
        } 
}



}
