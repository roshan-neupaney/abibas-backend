import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}
  create(createBrandDto: CreateBrandDto) {
    return this.prisma.brand.create({ data: createBrandDto });
  }

  findAll() {
    return this.prisma.brand.findMany();
  }

  findAllActive() {
    return this.prisma.brand.findMany({
      where: {
        status: 'ACTIVE',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.brand.findUnique({ where: { id } });
  }

  update(id: string, updateBrandDto: UpdateBrandDto) {
    return this.prisma.brand.update({
      where: { id },
      data: updateBrandDto,
    });
  }

  remove(id: string) {
    return this.prisma.brand.delete({
      where: { id },
    });
  }
}
