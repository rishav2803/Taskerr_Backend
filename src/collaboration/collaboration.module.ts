import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Collaboration, CollaborationSchema } from './collaboration.schema';
import { CollaborationController } from './collaboration.controller';
import { CollaborationService } from './collaboration.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Collaboration.name, schema: CollaborationSchema }]),
  ],
  controllers: [CollaborationController],
  providers: [CollaborationService]
})
export class CollaborationModule { }
