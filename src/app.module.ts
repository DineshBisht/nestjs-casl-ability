import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AbilityModule } from './ability/ability.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { InvoicesModule } from './invoices/invoices.module';
import { CaslAbilityModule } from './casl-ability/casl-ability.module';
import { ObjectsModule } from './objects/objects.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'casl_example',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CaslAbilityModule,
    UserModule,
    AbilityModule,
    AuthModule,
    ProjectsModule,
    RolesModule,
    PermissionsModule,
    InvoicesModule,
    ObjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
