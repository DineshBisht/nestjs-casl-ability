import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class UpdateProjectDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Project name' })
  name: string;
}
