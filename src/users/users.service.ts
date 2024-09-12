import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./users.schema";
import { Model } from "mongoose";
import { RegisterUserDto } from "./dto/RegisterUser.dto";
import { LoginUserDto } from "./dto/LoginUser.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { Token } from "src/schemas/tokens.schema";
import { MailerService } from "src/mailer/mailer.service";
import { GenerateLink } from "src/utils/generateLink.helper";
import emailVerificationTemplate from "src/mailer/templates/EmailVerification.template";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly generateLinkService: GenerateLink,
  ) { }


  async activateAccount(token: string): Promise<UserDocument | null> {

    try {
      const tokenDoc = await this.tokenModel.findOne({ token }).exec();

      if (!tokenDoc) {
        throw new UnauthorizedException('Invalid or expired activation link.');
      }

      const decodedToken = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get<string>("ACCESS_SECRET_TOKEN"),
        }

      );
      if (!decodedToken || !decodedToken.email) {
        throw new BadRequestException('Invalid activation token payload.');
      }

      const user = await this.userModel.findOne({ email: decodedToken.email }).exec();
      if (!user) {
        throw new NotFoundException('User not found.');
      }

      if (user.isActivated) {
        throw new BadRequestException('User is already activated.');
      }

      user.isActivated = true;

      await user.save();

      await this.tokenModel.deleteOne({ _id: tokenDoc._id }).exec();

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired activation link.');
    }

  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<UserDocument> {
    console.log(registerUserDto);
    const existingUser = await this.userModel.findOne({ email: registerUserDto.email }).exec();
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    console.log("existing user", existingUser);

    const newUser = new this.userModel({
      ...registerUserDto
    });



    const payload = { username: newUser.name, email: newUser.email };

    const verificationToken = await this.jwtService.signAsync(payload, { expiresIn: "1h" });

    const link = this.generateLinkService.generateLink(verificationToken, "activate-account");


    try {
      await this.mailerService.scheduleEmail(
        registerUserDto.email,
        'Registration Confirmation',
        'Please confirm your registration.',
        emailVerificationTemplate(link)
      );

      const user = await newUser.save()

      const newToken = new this.tokenModel({
        userId: user._id,
        token: verificationToken,
        type: "verification"
      })

      await newToken.save();

      return user;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error registering user');
    }

  }

  async loginUser(loginUserDto: LoginUserDto):
    Promise<{
      access_token: string,
      refresh_token: string
      name: string,
      email: string
    }> {
    console.log(loginUserDto);

    const user = await this.userModel.findOne({ email: loginUserDto.email });
    if (!user) {
      throw new NotFoundException("User not found");
    }



    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { uid: user._id.toString(), username: user.name, email: user.email };

    const access_token = await this.jwtService.signAsync(payload, { expiresIn: "30m" });
    const refresh_token = await this.jwtService.signAsync(payload, { expiresIn: "7d" });

    return {
      name: user.name,
      email: user.email,
      access_token,
      refresh_token,
    };

  }


  async getAllUsers(): Promise<UserDocument[]> {
    try {
      console.log("Inside here", await this.userModel.find())
      return await this.userModel.find();
    } catch (error) {
      throw new BadRequestException('Error registering user');
    }

  }


}
