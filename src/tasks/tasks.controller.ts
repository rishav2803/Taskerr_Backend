import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/users/users.guard';
import { ResponseHelper } from 'src/utils/response.helper';
import { Response } from "express"

@Controller('')
export class TasksController {

  constructor(private tasksService: TasksService) { }


  @UseGuards(AuthGuard)
  @Get("/api/tasks")
  async getAllTasks(@Request() req: Request, @Res() res: Response) {
    try {
      const users = await this.tasksService.getAllTasks(req);
      return ResponseHelper.success(res, users, 'Fetched all the users', 201);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }


}
