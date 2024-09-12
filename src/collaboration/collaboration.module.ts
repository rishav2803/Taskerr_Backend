import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Collaboration, CollaborationSchema } from './collaboration.schema';
import { CollaborationController } from './collaboration.controller';
import { CollaborationService } from './collaboration.service';
import { Token, TokenSchema } from 'src/schemas/tokens.schema';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Collaboration.name, schema: CollaborationSchema },
    { name: Token.name, schema: TokenSchema }
    ]),
  ],
  controllers: [CollaborationController],
  providers: [CollaborationService, MailerService]
})
export class CollaborationModule { }
