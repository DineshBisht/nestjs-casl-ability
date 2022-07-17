import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './create-invoice.dto';
import { Invoice } from './invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) readonly invoceRepo: Repository<Invoice>,
  ) {}

  findAll() {
    return this.invoceRepo.find();
  }

  findOne(invoceId: number) {
    return this.invoceRepo.findOne({ where: { id: invoceId } });
  }

  async create(invoiceDto: CreateInvoiceDto) {
    try {
      const invoice = this.invoceRepo.create(invoiceDto);
      return await this.invoceRepo.save(invoice);
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(invoiceId: number) {
    const invoice = await this.findOne(invoiceId);
    if (!invoice)
      throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);

    return this.invoceRepo.delete({ id: invoiceId });
  }

  async update(invoceId: number, invoiceData) {
    const invoice = await this.findOne(invoceId);
    if (!invoice)
      throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);

    invoice.name = invoiceData.name;
    invoice.user = invoiceData.user;

    return await this.invoceRepo.save(invoice);
  }
}
