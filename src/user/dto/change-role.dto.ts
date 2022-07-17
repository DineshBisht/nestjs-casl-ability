import { IsNotEmpty, IsNumber } from 'class-validator';
import { Roles } from 'src/roles/role.entity';

export class ChangeRoleDto {
  @IsNotEmpty()
  @IsNumber()
  user: number;

  @IsNotEmpty()
  @IsNumber()
  role: Roles;
}
