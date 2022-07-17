import { Global, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AbilityFactory } from './ability.factory';
import { PermissionsGuard } from './permission.guard';

@Global()
@Module({
  providers: [AbilityFactory, PermissionsGuard],
  exports: [AbilityFactory, PermissionsGuard],
})
export class AbilityModule {}
