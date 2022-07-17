import { PermissionAction } from './permission.action.enum';

export interface CaslPermission {
  action: PermissionAction;
  subject: string;
  condition?: {};
}
