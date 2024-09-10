import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { UserService } from "./users.service";
import { RegisterUserDto } from "./dto/RegisterUser.dto";
import { ResponseHelper } from "src/utils/response.helper";
import { Response } from "express"
import { LoginUserDto } from "./dto/LoginUser.dto";


@Controller()

export class UsersController {

  constructor(private usersService: UserService) { }

  @Post("/api/register")
  async registerUser(@Body() registerUserDto: RegisterUserDto, @Res() res: Response) {
    try {
      const user = await this.usersService.registerUser(registerUserDto);
      console.log(user);
      return ResponseHelper.success(res, user, 'User registered successfully', 201);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }


  @Post("/api/login")
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const data = await this.usersService.loginUser(loginUserDto);
      console.log(data);
      return res.status(201).json({
        status: 'success',
        message: "User Logged In successfully",
        ...data,
      });
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }

  @Get("/api/all/users")
  async getAllUsers(@Res() res: Response) {
    try {
      const users = await this.usersService.getAllUsers();
      return ResponseHelper.success(res, users, 'Fetched all the users', 201);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }
}

