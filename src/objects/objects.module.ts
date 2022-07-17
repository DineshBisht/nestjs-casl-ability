import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectsController } from './objects.controller';
import { Objects } from './objects.entity';
import { ObjectsService } from './objects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Objects])],
  controllers: [ObjectsController],
  providers: [ObjectsService],
})
export class ObjectsModule {}
