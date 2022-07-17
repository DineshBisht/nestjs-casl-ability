import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionAction } from 'src/ability/permission.action.enum';
import { CheckPermissions } from 'src/ability/permission.decorator';
import { PermissionsGuard } from 'src/ability/permission.guard';
import { JwtAuthenticationGuard } from 'src/auth/jwt.authentication.guard';
import { CreateRolesDto } from './dtos/create-roles.dto';
import { ResponseRolesDto } from './dtos/response.dto';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiForbiddenResponse({
  description: 'If user not authorized show forbidden in response',
})
@UseGuards(JwtAuthenticationGuard)
export class RolesController {
  constructor(private rolesServ: RolesService) {}
  @ApiOkResponse({
    description: 'It will retrive all the projects list if user is logged in',
    type: [ResponseRolesDto],
  })
  @Get()
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, 'Roles'])
  findAll() {
    try {
      return this.rolesServ.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.CREATE, 'Roles'])
  @Post()
  create(@Body() createRoleDto: CreateRolesDto) {
    return this.rolesServ.create(createRoleDto);
  }

  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.UPDATE, 'Roles'])
  @Patch(':roleId')
  async update(
    @Param('roleId') roleId: string,
    @Body() roleInfo: CreateRolesDto,
  ) {
    return await this.rolesServ.update(+roleId, roleInfo);
  }
}
