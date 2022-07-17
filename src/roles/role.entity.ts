import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from '../permissions/permission.entity';
import { User } from '../user/entities/user.entity';

@Entity({ name: 'roles' })
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user: User) => user.roles)
  user: User[];

  @ManyToMany(() => Permission, (permission: Permission) => permission.roles)
  @JoinTable()
  permissions: Permission[];
}
