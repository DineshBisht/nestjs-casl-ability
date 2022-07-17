import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { Permission } from 'src/permissions/permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dtos/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    readonly permissionRepo: Repository<Permission>,
    readonly rolesServ: RolesService,
  ) {}

  async findAll() {
    return this.permissionRepo.find({ relations: ['roles'] });
  }
  async findPermissionByRole(roleId: number) {
    const rolesAndPermissions = await this.permissionRepo
      .createQueryBuilder('permission')
      .innerJoinAndSelect('permission.roles', 'roles')
      .innerJoinAndSelect('permission.object', 'object')

      .where('roles.id=:roleId')
      .setParameter('roleId', roleId)
      .getMany();

    if (rolesAndPermissions) {
      const roleInfo = rolesAndPermissions.map((data) => ({
        permissions: data.action,
        role: data.roles[0].name,
        resource: data.object.name,
      }));
      return roleInfo;
    } else {
      throw new HttpException(
        'Permission not found in this role',
        HttpStatus.NOT_FOUND,
      );
    }
  }
  findOne(permissionId: number) {
    return this.permissionRepo.findOne({ where: { id: permissionId } });
  }
  async create(createPermisionDto: CreatePermissionDto) {
    try {
      const permission = await this.permissionRepo.create(createPermisionDto);
      const role = await this.rolesServ.findOne(createPermisionDto.role);
      permission.roles = [role];
      return await this.permissionRepo.save(permission);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async delete(permissionId: number) {
    try {
      const permission = await this.findOne(permissionId);
      permission.roles = null;
      permission.object = null;

      return this.permissionRepo.remove(permission);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
