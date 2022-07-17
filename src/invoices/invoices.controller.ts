import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { PermissionAction } from 'src/ability/permission.action.enum';
import { CheckPermissions } from 'src/ability/permission.decorator';
import { PermissionsGuard } from 'src/ability/permission.guard';
import { JwtAuthenticationGuard } from 'src/auth/jwt.authentication.guard';
import { CreateInvoiceDto } from './create-invoice.dto';
import { InvoicesService } from './invoices.service';

@ApiTags('Invoices')
@Controller('invoices')
@ApiExcludeController()
@UseGuards(JwtAuthenticationGuard)
export class InvoicesController {
  constructor(private invoiceServ: InvoicesService) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.READ, 'Invoice'])
  async findAll() {
    return await this.invoiceServ.findAll();
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.CREATE, 'Invoice'])
  async create(@Body() createInvoceDto: CreateInvoiceDto, @Req() req) {
    createInvoceDto.user = req.user;
    return await this.invoiceServ.create(createInvoceDto);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @CheckPermissions([PermissionAction.UPDATE, 'Invoice'])
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: any,
    @Req() req,
  ) {
    updateInvoiceDto.user = req.user;
    return await this.invoiceServ.update(+id, updateInvoiceDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.invoiceServ.delete(+id);
  }
}
