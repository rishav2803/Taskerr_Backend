import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/users/users.guard';
import { ResponseHelper } from 'src/utils/response.helper';
import { Response } from "express"
import { CollaborationService } from './collaboration.service';
import { ShareCollabInviteDto } from './dto/ShareCollabInvite.dto';

@Controller('')
export class CollaborationController {

  constructor(private collaborationService: CollaborationService) { }


  @UseGuards(AuthGuard)
  @Post("/api/invite")
  async shareCollabInvite(@Body() shareCollabInviteDto: ShareCollabInviteDto, @Res() res: Response) {
    try {
      const users = await this.collaborationService.shareCollabInvite(shareCollabInviteDto);
      return ResponseHelper.success(res, users, 'Fetched all the users', 201);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }


}
