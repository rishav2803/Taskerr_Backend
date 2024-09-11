import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { Token, TokenSchema } from 'src/schemas/tokens.schema';
import { GenerateLink } from 'src/utils/generateLink.helper';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("ACCESS_SECRET_TOKEN"),
      }),
      inject: [ConfigService],
      global: true
    }),
  ],
  providers: [UserService, GenerateLink, MailerService],
  controllers: [UsersController]
})
export class UserModule { }

