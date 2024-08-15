import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VideoService {

  constructor(private prisma: PrismaService) {}
  async create(createVideoDto: CreateVideoDto) {
    return await this.prisma.videos.create({ data: createVideoDto });
  }

  async findAll() {
    return await this.prisma.videos.findMany();
  }

  findOne(id: string) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
