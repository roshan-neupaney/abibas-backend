import { Injectable } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class InteractionService {
  constructor(private prisma: PrismaService) {}
  create(createInteractionDto: CreateInteractionDto) {
    return this.prisma.interaction.create({ data: createInteractionDto });
  }

  async findAll() {
    const interactions = await this.prisma.interaction.findMany();
    return interactions;
  }

  async findHybridRecommendation(user_id: string, shoe_id: string) {
    const idShoe = await this.prisma.shoe.findUnique({
      where: { slug_url: shoe_id },
      select: { id: true },
    });
    const { data } = await axios.get(
      `http://localhost:5000/recommend?user_id=${user_id}&shoe_id=${idShoe.id}`,
    );
    const { recommended_shoes } = data;
    const shoes = await this.prisma.shoe.findMany({
      where: {
        id: {
          in: recommended_shoes,
        },
      },
      select: {
        id: true,
        title: true,
        slug_url: true,
        category: {
          select: {
            id: true,
            title: true,
          },
        },
        colorVariation: true,
        type: true,
        price: true,
      },
    });
    return shoes;
  }

  async findCollaborativeRecommendation(user_id: string) {
    const { data } = await axios.get(
      `http://localhost:5000/collaborative-recommend?user_id=${user_id}`,
    );
    const { recommended_shoes } = data;
    console.log(recommended_shoes);
    const shoes = await this.prisma.shoe.findMany({
      where: {
        id: {
          in: recommended_shoes,
        },
      },
      select: {
        id: true,
        title: true,
        slug_url: true,
        category: {
          select: {
            id: true,
            title: true,
          },
        },
        colorVariation: true,
        type: true,
        price: true,
      },
    });
    console.log(recommended_shoes);
    return shoes;
  }

  findOne(id: number) {
    return `This action returns a #${id} interaction`;
  }

  update(id: number, updateInteractionDto: UpdateInteractionDto) {
    return `This action updates a #${id} interaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} interaction`;
  }


  // async transferAll() {
  //   try {
  //     const { data: interactions } = await axios.get('https://abibas-backend-1.vercel.app/interaction');
  
  //     for (const interaction of interactions) {
  //       await this.prisma.interaction.create({
  //         data: {
  //           user_id: interaction.user_id,
  //           shoe_id: interaction.shoe_id,
  //           action_type: interaction.action_type,
  //           rate: interaction.rate,
  //           interaction_score: interaction.interaction_score,
  //           isActive: interaction.isActive,
  //           createdAt: interaction.create_at,
  //           updatedAt: interaction.updated_at
  //         },
  //       });
  //     }
  
  //     console.log('Data stored successfully in local DB');
  //     return 'Data stored successfully in local DB';
  //   } catch (error) {
  //     console.error('Error fetching interactions:', error);
  //   }
  // }
  // async transferAllUsers() {
  //   try {
  //     const { data: interactions } = await axios.get('https://abibas-backend-1.vercel.app/user');
      
  //     for (const interaction of interactions) {
  //       await this.prisma.myUsers.create({
  //         data: {
  //           hash: interaction.hash,
  //           hashedRt: interaction.hashedRt,
  //           email: interaction.email,
  //           firstName: interaction.firstName,
  //           lastName: interaction.lastName,
  //           mobile: interaction.mobile,
  //           status: interaction.status,
  //           role: interaction.role,
  //           createdAt: interaction.createAt,
  //           updatedAt: interaction.updatedAt
  //         },
  //       });
  //     }
  
  //     console.log('Data stored successfully in local DB');
  //     return interactions;
  //   } catch (error) {
  //     console.error('Error fetching interactions:', error);
  //   }
  // }
}
