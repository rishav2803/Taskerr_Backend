import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ versionKey: false, timestamps: true })
export class Token {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true, enum: ['verification', 'passwordReset', 'invite'] })
  type: string;

}

export const TokenSchema = SchemaFactory.createForClass(Token);
