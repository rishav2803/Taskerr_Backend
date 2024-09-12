import { ArrayMinSize, IsDate, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsString, Length, Matches, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

class Subtasks {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(["todo", "doing", "done"])
  status: "todo" | "doing" | "done";
}

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Task Name is required' })
  @IsString()
  task_name: string;

  @IsNotEmpty({ message: 'Deadline is required' })
  @Type(() => Date)
  @IsDate()
  deadline: Date;

  @IsNotEmpty()
  @IsMongoId()
  user_id: string;

  @ValidateNested({ each: true })
  @Type(() => Subtasks)
  @ArrayMinSize(1)
  subtasks: Subtasks[];
}

