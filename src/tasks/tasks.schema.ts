import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Subtask } from 'src/subtasks/subtasks.schema';
import { User } from 'src/users/users.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ versionKey: false, timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Task {
  @Prop({ required: true })
  task_name: string;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: User;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Subtask' }], default: [] })
  subtasks: Subtask;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
