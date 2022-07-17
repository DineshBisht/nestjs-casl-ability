import { IsNotEmpty, IsString } from 'class-validator';
import { Roles } from 'src/roles/role.entity';
import { Objects } from 'src/objects/objects.entity';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  action: string;

  @IsNotEmpty()
  object: Objects;

  @IsNotEmpty()
  role: Roles;
}
