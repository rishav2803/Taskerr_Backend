import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collaboration, CollaborationDocument } from './collaboration.schema';
import { ShareCollabInviteDto } from './dto/ShareCollabInvite.dto';

@Injectable()
export class CollaborationService {
  constructor(@InjectModel(Collaboration.name) private readonly collaborationModel: Model<CollaborationDocument>) { }

  async shareCollabInvite(inviteDetailsDto: ShareCollabInviteDto): Promise<{ inviteLink: string }> {
    console.log(inviteDetailsDto);
    return { inviteLink: "" }
  }
}
