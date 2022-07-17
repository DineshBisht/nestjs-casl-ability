import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateObjectDto } from './dtos/create-object.dto';
import { Objects } from './objects.entity';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectRepository(Objects) private readonly objRepo: Repository<Objects>,
  ) {}

  findAll() {
    return this.objRepo.find();
  }

  async create(createObjectDto: CreateObjectDto) {
    const info = await this.objRepo.create(createObjectDto);
    return await this.objRepo.save(info);
  }

  async update(objectId: number, objInfo: CreateObjectDto) {
    const record = await this.objRepo.findOne({ where: { id: objectId } });
    if (!record)
      throw new NotFoundException('Record not found with this resource id ');

    record.name = objInfo.name;
    return this.objRepo.save(record);
  }

  async delete(objectId: number) {
    const record = await this.objRepo.findOne({ where: { id: objectId } });
    if (!record)
      throw new NotFoundException('Record not found with this resource id ');
    return await this.objRepo.delete(record);
  }
}
