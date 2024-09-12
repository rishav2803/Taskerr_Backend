import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/users/users.guard';
import { ResponseHelper } from 'src/utils/response.helper';
import { Response } from "express"
import { CreateTaskDto } from './dto/CreateTask.dto';

@Controller('')
export class TasksController {

  constructor(private tasksService: TasksService) { }


  @UseGuards(AuthGuard)
  @Post("/api/tasks")
  async createTask(@Body() createTaskDto: CreateTaskDto, @Res() res: Response) {
    try {
      console.log(createTaskDto)
      const users = await this.tasksService.createTask(createTaskDto);
      return ResponseHelper.success(res, users, 'Successfully created the new task', 201);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }


  @UseGuards(AuthGuard)
  @Get("/api/tasks")
  async getAllTasks(@Request() req: Request, @Res() res: Response) {
    try {
      const users = await this.tasksService.getAllTasks(req);
      return ResponseHelper.success(res, users, 'Fetched all the tasks', 201);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }


}
