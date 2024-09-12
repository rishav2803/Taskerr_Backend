import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Subtask, SubtaskSchema } from './subtasks.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subtask.name, schema: SubtaskSchema }]),
  ],
  exports: [MongooseModule]
})

export class SubTaskModule { }

