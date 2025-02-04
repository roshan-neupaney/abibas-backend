import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EsewaService {
  constructor(
    private prisma: PrismaService,
  ) {}
  async Payment(decodedData: any, hash: string, id: string) {
    if (decodedData.status === 'COMPLETE') {
      if (hash === decodedData.signature) {
        return await this.prisma.$transaction(async (prisma) => {
          const paymentRes = await prisma.payment.create({
            data: {
              order_id: id,
              amount: decodedData.total_amount,
            },
          });
          return { paymentId: paymentRes.id, id };
        });
      }
    }
  }

  // async findProduct(id: string) {
  //   const product = await this.prisma.shoe.findUnique({ where: { id } });

  //   return { price: product.price };
  // }

  // async VerifyPayment(
  //   product_code: string,
  //   total_amount: string,
  //   transaction_uuid: string,
  //   orderId: string,
  //   paymentId: string,
  // ) {
  //   return await this.prisma.$transaction(async (prisma) => {
  //     const amount = total_amount.replace(',', '');
  //     const res = await axios.get(
  //       `https://uat.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${amount}&transaction_uuid=${transaction_uuid}`,
  //     );

  //     if (res.data.status === 'COMPLETE') {
  //       const orderRes = await prisma.order.update({
  //         where: { id: orderId },
  //         data: { status: 'COMPLETED' },
  //         include: {
  //           orderItems: true,
  //         },
  //       });
  //       await prisma.payment.update({
  //         where: { id: paymentId },
  //         data: { status: 'SUCCESS' },
  //       });
  //       orderRes.orderItems.map(async (items: CreateOrderItemsDto) => {
  //         const sizeRes = await prisma.size.findFirst({
  //           where: {
  //             color_variation_id: items.color_variation_id,
  //             size: items.size,
  //           },
  //         });
  //         await prisma.size.update({
  //           where: { id: sizeRes.id },
  //           data: {
  //             size: (Number(sizeRes.stock) - items.count).toString(),
  //           },
  //         });
  //         await prisma.cart.deleteMany({
  //           where: {
  //             color_variation_id: items.color_variation_id,
  //             size: items.size,
  //           },
  //         });
  //       });
  //     } else {
  //       await this.prisma.order.update({
  //         where: { id: orderId },
  //         data: { status: 'CANCELLED' },
  //       });
  //       await this.prisma.payment.update({
  //         where: { id: paymentId },
  //         data: { status: 'FAILED' },
  //       });
  //     }
  //   });
  // }
}
