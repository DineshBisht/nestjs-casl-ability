import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import helper from 'src/helper';
import { Repository } from 'typeorm';
import { ChangeRoleDto } from './dto/change-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userRepo.create(createUserDto);
    return await this.userRepo.save(newUser);
  }
  async login(loginDto: LoginDto) {
    const user = await this.findByEmail(loginDto.email);
    if (!user) {
      throw new HttpException(
        'User not found on this email id',
        HttpStatus.NOT_FOUND,
      );
    }
    const verifiedUser = await helper.verifyPassword(
      loginDto.password,
      user.password,
    );
    if (!verifiedUser) {
      throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
    }
    user.password = null;
    return user;
  }
  async findAllUserPermissions() {
    const { roles } = await this.userRepo
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.roles', 'roles')
      .innerJoinAndSelect('roles.permissions', 'permission')
      .innerJoinAndSelect('permission.object', 'objects')
      //.leftJoinAndSelect('permissions.rolePermissions', 'objects')
      .where('user.id=:user_id')
      // .setParameter('user_id', userId)
      .getOne();

    return roles.permissions.map((permission) => ({
      action: permission.action,
      subject: permission.object.name,
      //conditions: permission.conditions,
    }));

    //return permissionsList;
  }
  async getUserPermission(userId) {
    const { roles } = await this.userRepo
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.roles', 'roles')
      .innerJoinAndSelect('roles.permissions', 'permission')
      .innerJoinAndSelect('permission.object', 'objects')
      //.leftJoinAndSelect('permissions.rolePermissions', 'objects')
      .where('user.id=:user_id')
      .setParameter('user_id', userId)
      .getOne();

    return roles.permissions.map((permission) => ({
      action: permission.action,
      subject: permission.object.name,
      conditions: permission.conditions,
    }));
  }
  findAll() {
    // return this.userRepo.findOne({
    //   where: { id: 1 },
    //   relations: ['roles'],
    // });
    return (
      this.userRepo
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.roles', 'roles')
        .innerJoinAndSelect('roles.permissions', 'permission')
        .innerJoinAndSelect('permission.object', 'objects')
        //.leftJoinAndSelect('permissions.rolePermissions', 'objects')
        .where('user.id=:user_id')
        .setParameter('user_id', 3)
        .getOne()
    );
    // return this.userRepo.findOne({
    //   where: { id: 1 },
    //   relations: ['roleId'],
    // });
    //return `This action returns all user`;
  }

  async findOne(userId: number) {
    return await this.userRepo.findOne({ where: { id: userId } });
  }
  async findUserInfo(userId: number) {
    return await this.userRepo
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.roles', 'roles')
      .innerJoinAndSelect('roles.permissions', 'permission')
      .innerJoinAndSelect('permission.object', 'objects')
      .where('user.id=:user_id')
      .setParameter('user_id', userId)
      .getOne();
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async changeRole(userInfo: ChangeRoleDto) {
    const user = await this.userRepo.findOne({
      where: { id: userInfo.user },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    try {
      user.roles = userInfo.role;
      return await this.userRepo.save(user);
    } catch (ex) {
      throw new HttpException(
        'Database error ' + ex.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
