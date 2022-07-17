import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory, AppAbility } from './ability.factory';
import {
  PERMISSION_CHECKER_KEY,
  RequiredPermission,
} from './permission.decorator';
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.get<RequiredPermission[]>(
        PERMISSION_CHECKER_KEY,
        context.getHandler(),
      ) || [];
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    const ability = await this.abilityFactory.createForUser(user.id);

    return requiredPermissions.every((permission) =>
      this.isAllowed(ability, permission),
    );
  }
  private isAllowed(
    ability: AppAbility,
    permission: RequiredPermission,
  ): boolean {
    return ability.can(...permission);
  }
}
