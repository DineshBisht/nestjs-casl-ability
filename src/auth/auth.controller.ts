import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from 'src/user/dto/login.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { JwtAuthenticationGuard } from './jwt.authentication.guard';
import { LocalAuthenticationGuard } from './local-authentication';
import RequestWithUser from './request-with-user-interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authSrv: AuthService) {}

  @ApiOkResponse({
    status: 200,
    description: 'Retrive the user information',
    type: UserDto,
  })
  @ApiOkResponse({
    status: 201,
    description: 'Retrive the user information',
    type: UserDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  //  @ApiQuery({enum:UserRole})
  @Post('register')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'username',
          description: 'Enter user name',
        },
        email: {
          type: 'string',
          example: 'User email',
          description: 'Enter user email',
        },
        password: {
          type: 'string',
          example: 'User password',
          description: 'Enter user password',
        },
        roles: {
          type: 'integer',
          example: '1 for User,2 for Admin,3 for Manager',
          description: 'Give permission to user',
        },
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authSrv.register(createUserDto);
  }

  @Post('login')
  @ApiOkResponse({
    description: 'Retrive the user information with some cookies',
    type: LoginDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @UseGuards(LocalAuthenticationGuard)
  login(
    @Body() loginDto: LoginDto,
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response,
  ) {
    const { user } = request;
    const cookie = this.authSrv.getCookieWithJwtToken(user.id);
    delete user.password;
    response.setHeader('Set-Cookie', cookie);

    response.send(user);
  }

  @Post('logout')
  @ApiOkResponse({
    description: 'Logout the user and remove the cookies ',
  })
  @UseGuards(JwtAuthenticationGuard)
  logout(@Res() response) {
    response.setHeader('Set-Cookie', this.authSrv.getCookieForLogout());
    response.sendStatus(200);
  }
}
