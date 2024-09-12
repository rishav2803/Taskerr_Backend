import { IsBoolean, IsMongoId, IsOptional, ValidateNested, ArrayMinSize, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

class PermissionsDto {
  @IsBoolean()
  view: boolean;

  @IsBoolean()
  edit: boolean;

  @IsBoolean()
  comment: boolean;
}

class CollaboratorDto {
  @IsMongoId()
  user_id: string;

  @ValidateNested()
  @Type(() => PermissionsDto)
  permissions: PermissionsDto;
}

export class ShareCollabInviteDto {
  @IsMongoId()
  task_id: string;

  @IsMongoId()
  user_id: string;

  @IsEmail()
  email: string

  @ValidateNested({ each: true })
  @Type(() => PermissionsDto)
  permissions: PermissionsDto;
}

