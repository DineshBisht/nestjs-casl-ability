import { User } from 'src/user/entities/user.entity';

export class Project {
  public id;
  public name;
  public user;
  constructor(projectInfo) {
    this.id = projectInfo.id;
    this.name = projectInfo.name;
    this.user = projectInfo.user.id;
  }
}
