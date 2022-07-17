import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user: User) => user.project)
  user: User;

  @CreateDateColumn({ name: 'created_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedAt: Date;
}
