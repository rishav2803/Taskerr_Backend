import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';


export type UserDocument = HydratedDocument<User>;


@Schema({ versionKey: false, timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class User {
  @Prop({ default: () => randomUUID(), unique: true, required: true })
  user_id: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;


  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isActivated: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

