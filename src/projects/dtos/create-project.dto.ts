import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Expose()
  name: string;
}
