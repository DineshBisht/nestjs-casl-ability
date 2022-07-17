import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionAction } from 'src/ability/permission.action.enum';
import { CheckPermissions } from 'src/ability/permission.decorator';
import { PermissionsGuard } from 'src/ability/permission.guard';
import { JwtAuthenticationGuard } from 'src/auth/jwt.authentication.guard';
import { CreateObjectDto } from './dtos/create-object.dto';
import { ObjectsService } from './objects.service';

@Controller('Resources')
@ApiTags('Resources')
@UseGuards(JwtAuthenticationGuard)
export class ObjectsController {
  constructor(private objServ: ObjectsService) {}

  @Get()
  @ApiResponse({
    description: 'It will give all resource lists',
    type: [CreateObjectDto],
  })
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, 'Resource'])
  async findAll() {
    return this.objServ.findAll();
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.CREATE, 'Resource'])
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Test',
          description: 'Resource name',
        },
      },
    },
  })
  async create(@Body() createObjectDto: CreateObjectDto) {
    return await this.objServ.create(createObjectDto);
  }

  @Patch(':resourceId')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.UPDATE, 'Resource'])
  async update(
    @Param('resourceId') resourceId: number,
    @Body() resourceInfo: CreateObjectDto,
  ) {
    return await this.objServ.update(resourceId, resourceInfo);
  }

  @Delete(':resourceId')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.DELETE, 'Resource'])
  async delete(@Param('resourceId') resourceId: number) {
    //return await this.objServ.delete(resourceId);
  }
}
