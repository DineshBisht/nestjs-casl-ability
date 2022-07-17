import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
  providers: [InvoicesService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
