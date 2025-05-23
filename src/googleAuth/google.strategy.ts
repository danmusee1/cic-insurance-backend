import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommonService } from 'src/shared/services/common.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(
    private readonly userService: UserService,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.NEXTAUTH_URL_API}/google/redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos, query } = profile;
    const email = emails[0].value;
    /*  const affiliatedBy = query.id; // Assuming 'affiliatedBy' is a query parameter in the redirect URL
 
     if (!affiliatedBy) {
       throw new UnauthorizedException('AffiliatedBy ID not provided');
     } */

    // Check if user already exists in the database
    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser) {
      // User exists, sign them in
      done(null, existingUser);
    } else {
      // User doesn't exist, create a new user
      const user = {
        email,
        firstName: name.givenName,
        middleName:name.middleName,
        phoneNumber:name.phoneNumber,
        username:name.username,
        address:name.address,
        lastName: name.familyName,
        password: await this.commonService.hashPassword(this.configService.get<string>('SECURE_GOOGLEAUTH_PASSWORD') || 'defaultPassword'),
      };

      const newUser = await this.userService.createUser(user);
      done(null, newUser);
    }
  }

  generateAffiliateId(): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const length = 5;
    let affiliateId = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      affiliateId += characters.charAt(randomIndex);
    }

    return affiliateId;
  }
}
