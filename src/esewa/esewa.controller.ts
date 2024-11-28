import {
  Controller,
  Get,
  Param,
  Render,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { EsewaService } from './esewa.service';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { AuthUserType } from 'src/common/FileType.type';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('esewa')
@ApiTags('esewa')
export class EsewaController {
  constructor(
    private readonly esewaService: EsewaService,
    private config: ConfigService,
    private paymentService: PaymentService,
  ) {}

  @Get('payment/:id')
  @Public()
  @Render('esewaPayment')
  async findPaymentPage(@Param('id') id: string) {
    const uuid = Math.floor(Math.random() * 10 * Date.now());
    const product_code = this.config.get<string>('PRODUCT_CODE');
    const key = this.config.get<string>('SECRET_KEY');

    const response = await this.esewaService.findProduct(id);

    const message = `total_amount=${response.price},transaction_uuid=${uuid},product_code=${product_code}`;
    var hash = crypto
      .createHmac('sha256', key)
      .update(message)
      .digest('base64');
    const product = {
      ...response,
      transaction_uuid: uuid,
      signature: hash,
      product_code,
      id,
    };
    return { product };
  }

  @Public()
  @Get('initialpayment/:id')
  async create(
    @Query('data') data: string,
    @Param('id') id: string,
    @AuthUser() user: AuthUserType,
  ) {
    const decodedString = atob(data);
    const decodedData = JSON.parse(decodedString);

    const key = this.config.get<string>('SECRET_KEY');

    const amount = decodedData.total_amount.replace(',', '');
    
    const message = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${decodedData.product_code},signed_field_names=${decodedData.signed_field_names}`;

    var hash = crypto
      .createHmac('sha256', key)
      .update(message)
      .digest('base64');

    const result = await this.esewaService.Payment(
      decodedData,
      hash,
      id,
    );
    await this.paymentService.verifyPayment(
      decodedData.product_code,
      decodedData.total_amount,
      decodedData.transaction_uuid,
      result.id,
      result.paymentId,
    );
  }

  @Public()
  @Post('test')
  async test(@Body() payload: any) {
    const uuid = Math.floor(Math.random() * 10 * Date.now());
    const product_code = this.config.get<string>('PRODUCT_CODE');
    const key = this.config.get<string>('SECRET_KEY');

    const message = `total_amount=${payload.total_amount},transaction_uuid=${uuid.toString()},product_code=${product_code}`;
    var hash = crypto
      .createHmac('sha256', key)
      .update(message)
      .digest('base64');
    payload.transaction_uuid = uuid.toString();
    payload.signature = hash;
    return await this.esewaService.test(payload);
  }
}
