import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChangeRoleDto } from 'src/user/dto/change-role.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
interface TokenPayload {
  userId: number;
}
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(userDto: CreateUserDto) {
    try {
      const createdUser = await this.userService.create(userDto);
      delete createdUser.password;
      return createdUser;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public getCookieWithJwtToken(userId: number) {
    const payLoad: TokenPayload = { userId };
    const token = this.jwtService.sign(payLoad);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age = 1d `;
  }

  public getCookieForLogout() {
    return `Authentication=;HttpOnly;Path=/;Max-Age=0`;
  }
}
