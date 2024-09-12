import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/users/users.guard';
import { ResponseHelper } from 'src/utils/response.helper';
import { CollaborationService } from './collaboration.service';
import { ShareCollabInviteDto } from './dto/ShareCollabInvite.dto';
import { Request, Response } from 'express';

@Controller('')
export class CollaborationController {

  constructor(private collaborationService: CollaborationService) { }


  @UseGuards(AuthGuard)
  @Post("/api/invite")
  async shareCollabInvite(@Body() shareCollabInviteDto: ShareCollabInviteDto, @Res() res: Response) {
    try {
      const users = await this.collaborationService.shareCollabInvite(shareCollabInviteDto);
      return ResponseHelper.success(res, {}, 'Invite send sucessfully!!!', 201);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }


  @Get("/api/invite/:token")
  async processInvite(@Query() query: any, @Req() req: Request, @Res() res: Response) {
    try {
      console.log(query);
      console.log(req.params);
      // const users = await this.collaborationService.shareCollabInvite(shareCollabInviteDto);
      return ResponseHelper.success(res, "", 'Fetched all the users', 201);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }


}
