import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AbilityFactory } from 'src/ability/ability.factory';
import { PermissionAction } from 'src/ability/permission.action.enum';
import { CheckPermissions } from 'src/ability/permission.decorator';
import { PermissionsGuard } from 'src/ability/permission.guard';
import { JwtAuthenticationGuard } from 'src/auth/jwt.authentication.guard';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptors';
import { CreateProjectDto } from './dtos/create-project.dto';
import { Project } from './dtos/project.dto';
import { ProjectResponseDto } from './dtos/project.response.dto';
import { UpdateProjectDto } from './dtos/update-project-dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthenticationGuard)
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiForbiddenResponse({
  description: 'If user not authorized show forbidden in response',
})
@UseInterceptors(new SerializeInterceptor(ProjectResponseDto))
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private abilityFactory: AbilityFactory,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Give all project information' })
  @ApiOkResponse({
    description: 'It will retrive list of projects',
    type: [ProjectResponseDto],
  })
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, 'Project'])
  async getAllProject(@Req() req) {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'It will get spacific project information',
    type: ProjectResponseDto,
  })
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, 'Project'])
  async getProject(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Post()
  @ApiOkResponse({
    status: 200,
    description: 'It will save the project informations',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 201,
    description: 'It will save the project informations',
    type: ProjectResponseDto,
  })
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.CREATE, 'Project'])
  async create(@Body() createProjectDto: CreateProjectDto, @Req() request) {
    return await this.projectsService.create(createProjectDto, request.user);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'It will update existing project information',
    type: ProjectResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() request,
  ) {
    const ability = await this.abilityFactory.createForUser(request.user.id);
    const projectInfo = await this.projectsService.findOne(+id);
    const condition = new Project(projectInfo);
    if (!ability.can(PermissionAction.UPDATE, condition)) {
      throw new ForbiddenException(
        'You dont have access to update this project',
      );
    }

    return await this.projectsService.update(
      +id,
      updateProjectDto,
      request.user,
    );
  }

  @ApiOkResponse({
    description: 'It will delete existing project ',
  })
  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.DELETE, 'Project'])
  async delete(@Param('id') id: string, @Req() request) {
    const ability = await this.abilityFactory.createForUser(request.user.id);
    const projectInfo = await this.projectsService.findOne(+id);
    const condition = new Project(projectInfo);
    if (!ability.can(PermissionAction.DELETE, condition)) {
      throw new ForbiddenException(
        'You dont have access to delete this project',
      );
    }

    return this.projectsService.delete(+id);
  }
}
