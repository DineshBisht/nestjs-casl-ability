import { Exclude } from 'class-transformer';
import helper from 'src/helper';
import { Invoice } from 'src/invoices/invoice.entity';
import { Project } from 'src/projects/project.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from '../../roles/role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ManyToOne(() => Roles, (roles: Roles) => roles.id)
  roles: Roles;

  @OneToMany(() => Project, (project: Project) => project.user)
  project: Project[];

  @OneToMany(() => Invoice, (invoice: Invoice) => invoice.user)
  invoice: Project[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashedPassword() {
    const newPass = await helper.hashedPassword(this.password);
    this.password = newPass;
  }
}
