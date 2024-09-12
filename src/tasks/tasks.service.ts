import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './tasks.schema';
import mongoose, { Model } from 'mongoose';
import { AuthGuard } from 'src/users/users.guard';
import { CreateTaskDto } from './dto/CreateTask.dto';
import { Subtask, SubtaskDocument } from 'src/subtasks/subtasks.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Subtask.name) private readonly subTaskModel: Model<SubtaskDocument>
  ) { }


  async createTask(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    console.log("Hello world", createTaskDto);
    const session = await this.taskModel.db.startSession();
    session.startTransaction();
    const { task_name, deadline, subtasks, user_id } = createTaskDto;
    try {

      const task = new this.taskModel({
        task_name,
        deadline,
        user_id
      });

      await task.save({ session });

      console.log(task);

      const subtaskPromises = subtasks.map(async (subtask) => {
        const newSubtask = new this.subTaskModel({
          description: subtask.description,
          status: subtask.status,
          task: task._id
        });

        await newSubtask.save({ session });
        return newSubtask._id;
      });

      const subtaskIds: any = await Promise.all(subtaskPromises);

      task.subtasks = subtaskIds;
      await task.save({ session });

      await session.commitTransaction();
      session.endSession();

      return task;
    } catch (error) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      console.log(error);
      throw new BadRequestException("Error creating the task")
    }
  }


  async getAllTasks(req: any): Promise<TaskDocument[]> {
    console.log(req.user);
    const { uid } = req.user;
    console.log(uid);
    try {
      return await this.taskModel.find({ user_id: uid }).populate('subtasks').exec();
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error fetching tasks');
    }
  }
}
