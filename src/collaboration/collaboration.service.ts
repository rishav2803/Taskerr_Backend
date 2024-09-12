import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collaboration, CollaborationDocument } from './collaboration.schema';
import { ShareCollabInviteDto } from './dto/ShareCollabInvite.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import getInviteTemplate from 'src/mailer/templates/Invite.template';
import { MailerService } from 'src/mailer/mailer.service';
import { Token, TokenDocument } from 'src/schemas/tokens.schema';

@Injectable()
export class CollaborationService {
  constructor(
    @InjectModel(Collaboration.name) private readonly collaborationModel: Model<CollaborationDocument>,
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailerService: MailerService,
  ) { }



  async shareCollabInvite(inviteDetailsDto: ShareCollabInviteDto): Promise<{ message: string }> {
    const { user_id, task_id, email, permissions } = inviteDetailsDto;


    try {

      const payload = { user_id, task_id, email, permissions };

      const inviteToken = await this.jwtService.signAsync(payload, { expiresIn: "1h" });

      if (!inviteToken) {
        throw Error("Failed to generate Invite link!!");
      }


      const baseUrl = this.configService.get<string>('BACKEND_BASE_URL');

      const acceptUrl = `${baseUrl}invite/${inviteToken}?state=accepted`;
      const rejectUrl = `${baseUrl}?state=rejected`;
      const htmlTemplate = getInviteTemplate(acceptUrl, rejectUrl);

      const emailContent = htmlTemplate;

      await this.mailerService.scheduleEmail(
        email,
        'Registration Confirmation',
        'Please confirm your registration.',
        emailContent
      );


      const newToken = new this.tokenModel({
        userId: user_id,
        token: inviteToken,
        type: "invite"
      })

      await newToken.save();

      return { message: "Invite sent succesfully!!!" }
    } catch (error) {
      console.log(error)
      throw new BadRequestException('Error while sending invite');
    }


  }
}
