import { Injectable } from '@nestjs/common';
import {
  InferSubjects,
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Project } from './project.entity';
import { ProjectsService } from './projects.service';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = InferSubjects<typeof Project>;
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class ProjectAbilityFactory {
  defineAbilityFor(project: Project) {
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );
    can(Action.Update, Project, { user: { id: 33 } });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
