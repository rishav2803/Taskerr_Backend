import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./users.schema";
import { Model } from "mongoose";
import { RegisterUserDto } from "./dto/RegisterUser.dto";
import { LoginUserDto } from "./dto/LoginUser.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) { }

  async registerUser(registerUserDto: RegisterUserDto): Promise<UserDocument> {
    console.log(registerUserDto);
    const existingUser = await this.userModel.findOne({ email: registerUserDto.email }).exec();
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    console.log("existing user", existingUser);

    const newUser = new this.userModel({
      registerUserDto
    });

    try {
      return await newUser.save();
    } catch (error) {
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
