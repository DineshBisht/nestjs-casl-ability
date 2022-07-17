import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Permission } from 'src/permissions/permission.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import {
  PermissionAction,
  PermissionObjectType,
} from './permission.action.enum';
import { CaslPermission } from './permission.interface';

export type AppAbility = Ability<[PermissionAction, PermissionObjectType]>;

@Injectable()
export class AbilityFactory {
  constructor(private userService: UserService) {}
  async createForUser(user: User) {
    console.log('user', user);
    const dbPermission = await this.userService.getUserPermission(user);

    const caslPermission: any = dbPermission.map((permission) => ({
      action: permission.action,
      subject: permission.subject,
      conditions: { user: 3 },
    }));

    console.log('caslpermission', caslPermission);
    return new Ability<[PermissionAction, PermissionObjectType]>(
      caslPermission,
    );
  }
}
