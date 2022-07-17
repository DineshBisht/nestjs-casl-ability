import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExcludeController,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionAction } from 'src/ability/permission.action.enum';
import { CheckPermissions } from 'src/ability/permission.decorator';
import { PermissionsGuard } from 'src/ability/permission.guard';
import { JwtAuthenticationGuard } from 'src/auth/jwt.authentication.guard';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { PermissionsService } from './permissions.service';

@ApiTags('Permission')
@Controller('permissions')
@UseGuards(JwtAuthenticationGuard)
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiForbiddenResponse({
  description: 'If user not authorized show forbidden in response',
})
export class PermissionsController {
  constructor(private permissionServ: PermissionsService) {}

  @Get(':role')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, 'Permission'])
  async findAll(@Param('role') role: string) {
    return await this.permissionServ.findPermissionByRole(+role);
  }

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        action: {
          type: 'enum',
          example: 'create|update|manage|delete|read',
          description: 'Give permission type',
        },
        role: {
          type: 'integer',
          example: '1 for User,2 for Admin , 3 for Manager',
          description: 'It must be a role Id',
        },
        object: {
          type: 'integer',
          example: '1 for Project | 2 for Invoice | 3 for All  resource',
          description:
            'Give permission to perticular resource or set All for all resource',
        },
      },
    },
  })
  // @UseGuards(PermissionsGuard)
  // @CheckPermissions([PermissionAction.CREATE, 'Permission'])
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionServ.create(createPermissionDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.DELETE, 'Permission'])
  async delete(@Param('id') permissionId: string) {
    return await this.permissionServ.delete(+permissionId);
  }
}
