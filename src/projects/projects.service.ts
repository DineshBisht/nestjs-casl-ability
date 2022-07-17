import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project-dto';
import { Project } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}
  async findAll() {
    return this.projectRepo.find({ relations: ['user'] });
  }
  async create(createProjectDto: CreateProjectDto, user: User) {
    const project = this.projectRepo.create(createProjectDto);
    project.user = user;
    return await this.projectRepo.save(project);
  }
  findOne(id: number) {
    return this.projectRepo.findOne({ where: { id }, relations: ['user'] });
  }
  async findOneForPermission(id: number) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    return {
      user: project.user.id,
    };
  }

  async update(projectId: number, record: UpdateProjectDto, user: User) {
    const project = await this.findOne(projectId);

    if (!project)
      throw new HttpException(
        'Project not found with this project id' + projectId,
        HttpStatus.NOT_FOUND,
      );

    project.name = record.name;
    project.user = user;

    return await this.projectRepo.save(project);
  }
  async delete(projectId: number) {
    const project = await this.findOne(projectId);

    if (!project)
      throw new HttpException(
        'Project not found with this project id' + projectId,
        HttpStatus.NOT_FOUND,
      );

    return await this.projectRepo.delete({ id: projectId });
  }
}
