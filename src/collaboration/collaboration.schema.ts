import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type CollaborationDocument = HydratedDocument<Collaboration>;

@Schema({ versionKey: false, timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Collaboration {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Task', required: true })
  task_id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner_id: Types.ObjectId;

  @Prop([{
    user_id: { type: MongooseSchema.Types.ObjectId, ref: 'User', required: true },
    permissions: {
      view: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      comment: { type: Boolean, default: false }
    }
  }])
  collaborators: {
    user_id: Types.ObjectId;
    permissions: {
      view: boolean;
      edit: boolean;
      comment: boolean;
    };
  }[];
}

export const CollaborationSchema = SchemaFactory.createForClass(Collaboration);

