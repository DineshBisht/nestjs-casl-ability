import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolesDto } from './dtos/create-roles.dto';
import { Roles } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles) private readonly rolesRepo: Repository<Roles>,
  ) {}

  findAll() {
    return this.rolesRepo.find();
  }

  async create(createRoleDto: CreateRolesDto) {
    try {
      const roles = await this.rolesRepo.create(createRoleDto);
      return await this.rolesRepo.save(roles);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(roleId) {
    return this.rolesRepo.findOne({ where: { id: roleId } });
  }

  async update(roleId: number, roleInfo: CreateRolesDto) {
    try {
      const role = await this.findOne(roleId);
      if (!role)
        throw new HttpException('Role not found', HttpStatus.NOT_FOUND);

      role.name = roleInfo.name;
      return await this.rolesRepo.save(role);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
