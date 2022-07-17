import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChangeRoleDto } from './dto/change-role.dto';
import { UserDto } from './dto/user.dto';
import { JwtAuthenticationGuard } from 'src/auth/jwt.authentication.guard';
import { PermissionsGuard } from 'src/ability/permission.guard';
import { PermissionAction } from 'src/ability/permission.action.enum';
import { CheckPermissions } from 'src/ability/permission.decorator';
import { AbilityFactory } from 'src/ability/ability.factory';
import { User } from './dto/user.map.dto';
@Controller('users')
@ApiTags('users')
@UseGuards(JwtAuthenticationGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private abilityFactory: AbilityFactory,
  ) {}

  @Get('/profile/:id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, 'User'])
  async getProfile(@Param('id') userId: string, @Req() request) {
    const ability = await this.abilityFactory.createForUser(request.user.id);
    const userInfo = await this.userService.findOne(+userId);
    if (!userInfo) throw new NotFoundException('User not found with this id');
    const condition = new User(userInfo);

    if (!ability.can(PermissionAction.READ, condition)) {
      throw new ForbiddenException(
        'You dont have access to read other user profile',
      );
    }

    return this.userService.findUserInfo(+userId);
  }

  @Post('change-role')
  @ApiOperation({ summary: 'It will assign new role to the user' })
  @ApiOkResponse({
    status: 200,
    description: 'It will return the new assigned role ',
    type: UserDto,
  })
  @ApiOkResponse({
    status: 201,
    description: 'It will return the new assigned role ',
    type: UserDto,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'integer',
          example: 1,
          description: 'Enter user id',
        },
        role: {
          type: 'integer',
          example: 1,
          description: 'Enter roles id',
        },
      },
    },
  })
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, 'Role'])
  async changeRole(@Body() roleInfo: ChangeRoleDto) {
    return await this.userService.changeRole(roleInfo);
  }
}
