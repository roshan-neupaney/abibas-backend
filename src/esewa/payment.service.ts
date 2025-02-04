import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}
  async verifyPayment(
    product_code: string,
    total_amount: string,
    transaction_uuid: string,
    orderId: string,
    paymentId: string,
  ) {
    return await this.prisma.$transaction(
      async (prisma) => {
        const amount = total_amount.replace(',', '');
        const res = await axios.get(
          `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${amount}&transaction_uuid=${transaction_uuid}`,
        );

        if (res.data.status === 'COMPLETE') {
          const orderRes = await prisma.order.update({
            where: { id: orderId },
            data: { status: 'COMPLETED' },
            include: {
              orderItems: {
                include: {
                  shoe: true,
                },
              },
            },
          });
          await prisma.payment.update({
            where: { id: paymentId },
            data: { status: 'SUCCESS' },
          });
          for (const item of orderRes.orderItems) {
            await prisma.interaction.create({
              data: {
                shoe_id: item.shoe_id,
                user_id: orderRes.user_id,
                interaction_score: 5,
                action_type: 'order',
              },
            });
            const sizeRes = await prisma.size.findFirst({
              where: {
                color_variation_id: item.color_variation_id,
                size: item.size,
              },
            });
            const shoeRes = await prisma.shoe.findUnique({
              where: {
                id: item.shoe_id,
              },
            });
            await prisma.shoe.update({
              where: {
                id: shoeRes.id,
              },
              data: {
                sold_amount: shoeRes.sold_amount + item.count,
              },
            });

            if (sizeRes) {
              await prisma.size.update({
                where: { id: sizeRes.id },
                data: {
                  stock: (Number(sizeRes.stock) - item.count).toString(),
                },
              });
              await prisma.cart.deleteMany({
                where: {
                  color_variation_id: item.color_variation_id,
                  size: item.size,
                },
              });
            }
          }
        } else {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
          });
          await prisma.payment.update({
            where: { id: paymentId },
            data: { status: 'FAILED' },
          });
        }
      },
      {
        timeout: 20000, // 20 seconds (increase if needed)
        isolationLevel: 'ReadCommitted', // Optional: Avoids unnecessary locks
      },
    );
  }
}
