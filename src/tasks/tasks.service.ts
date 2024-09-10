import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './tasks.schema';
import { Model } from 'mongoose';
import { AuthGuard } from 'src/users/users.guard';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>) { }

  async getAllTasks(req: any): Promise<TaskDocument[]> {
    console.log(req.user);
    const { sub } = req.user;
    console.log(sub);
    try {
      return await this.taskModel.find({ user_id: sub }).populate('subtasks').exec();
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error fetching tasks');
    }
  }
}
