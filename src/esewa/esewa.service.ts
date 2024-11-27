import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthUserType } from 'src/common/FileType.type';
import { PaymentService } from './payment.service';

@Injectable()
export class EsewaService {
  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentService,
  ) {}
  async Payment(
    decodedData: any,
    user_id: string,
    hash: string,
    shoe_id: string,
  ) {
    // if (decodedData.status === 'COMPLETE') {
    //   console.log(user_id);
    //   if (hash === decodedData.signature) {
    //     return await this.prisma.$transaction(async (prisma) => {
    //       const orderRes = await prisma.order.create({
    //         data: {
    //           user_id: user_id,
    //           total_amount: decodedData.total_amount,
    //         },
    //       });
    //       const paymentRes = await prisma.payment.create({
    //         data: {
    //           orderId: orderRes.id,
    //           amount: decodedData.total_amount,
    //         },
    //       });
    //       return { orderId: orderRes.id, paymentId: paymentRes.id };
    //     });
        
    //   }
    // }
  }

  async findProduct(id: string) {
    const product = await this.prisma.shoe.findUnique({ where: { id } });

    return { price: product.price };
  }

  async VerifyPayment(
    product_code: string,
    total_amount: string,
    transaction_uuid: string,
    orderId: string,
    paymentId: string,
  ) {
    return await this.prisma.$transaction(async (prisma) => {
      const amount = total_amount.replace(',', '');
      const res = await axios.get(
        `https://uat.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${amount}&transaction_uuid=${transaction_uuid}`,
      );

      if (res.data.status === 'COMPLETE') {
        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: 'COMPLETED' },
        });
        await this.prisma.payment.update({
          where: { id: paymentId },
          data: { status: 'SUCCESS' },
        });
      } else {
        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: 'CANCELLED' },
        });
        await this.prisma.payment.update({
          where: { id: paymentId },
          data: { status: 'FAILED' },
        });
      }
    });
  }
}
