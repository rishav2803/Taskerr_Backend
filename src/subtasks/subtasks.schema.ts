import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Task } from 'src/tasks/tasks.schema';

export type SubtaskDocument = Subtask & Document;

@Schema({ versionKey: false, timestamps: true })
export class Subtask {
  @Prop({ required: true })
  description: string;

  @Prop({
    type: String,
    enum: ['todo', 'doing', 'done'],
    default: 'todo'
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Task', required: true })
  task: Types.ObjectId | Task;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);
