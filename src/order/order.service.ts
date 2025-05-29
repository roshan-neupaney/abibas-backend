import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderItemsDto } from './dto/create-order-items.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        firstName: createOrderDto.firstName,
        lastName: createOrderDto.lastName,
        province: createOrderDto.province,
        district: createOrderDto.district,
        municipality: createOrderDto.municipality,
        ward: createOrderDto.ward,
        phone: createOrderDto.phone,
        total_amount: createOrderDto.total_amount,
        items_total_price: createOrderDto.items_total_price,
        tax_amount: createOrderDto.tax_amount,
        delivery_charge: createOrderDto.delivery_charge,
        status: createOrderDto.status,
        shipping_status: createOrderDto.shipping_status,
        user_id: createOrderDto.user_id,
        orderItems: {
          create: createOrderDto.orderItems.map(
            (items: CreateOrderItemsDto) => ({
              shoe_id: items.shoe_id,
              price: items.price,
              size: items.size,
              color_variation_id: items.color_variation_id,
              count: items.count,
            }),
          ),
        },
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            shoe: true,
            colorVariation: true,
          },
        },
        payment: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto as Prisma.OrderUncheckedUpdateInput,
      include: {
        orderItems: true,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
