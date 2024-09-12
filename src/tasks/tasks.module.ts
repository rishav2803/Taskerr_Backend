import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './tasks.schema';
import { SubTaskModule } from 'src/subtasks/subtasks.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    SubTaskModule
  ],
  providers: [TasksService],
  controllers: [TasksController]
})
export class TasksModule { }
