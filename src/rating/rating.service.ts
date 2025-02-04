import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}
  async create(createRatingDto: CreateRatingDto) {
    const result = this.prisma.$transaction(async(prisma) => {
      await prisma.interaction.create({
        data: {
          shoe_id: createRatingDto.shoe_id,
          user_id: createRatingDto.user_id,
          interaction_score: createRatingDto.rate,
          action_type: 'rating',
          rate: createRatingDto.rate,
        },
      });
      return await prisma.rating.create({ data: createRatingDto });
    })
    return result;
  }

  findAll() {
    return this.prisma.rating.findMany();
  }

  findOne(id: string) {
    return this.prisma.rating.findUnique({ where: { id } });
  }

  update(id: string, updateRatingDto: UpdateRatingDto) {
    return this.prisma.rating.update({ data: updateRatingDto, where: { id } });
  }

  remove(id: string) {
    return this.prisma.rating.delete({ where: { id } });
  }
}
