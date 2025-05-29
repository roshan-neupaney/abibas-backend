import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    try {
      const hashed = await argon.hash(data.password);
      return await this.prisma.myUsers.create({
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          mobile: data.mobile,
          hash: hashed,
          role: data.role,
          image_name: data.image_name,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          email: true,
          firstName: true,
          lastName: true,
          mobile: true,
          role: true,
          status: true,
          image_name: true,
          hash: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('The user already exists by this email');
        }
      }
      throw error;
    }
  }

  async findAll() {
    const user = this.prisma.myUsers.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        firstName: true,
        lastName: true,
        mobile: true,
        role: true,
        status: true,
        image_name: true,
        hash: true,
        hashedRt: true,
      },
    });
    return user;
  }

  async findOne(id: string) {
    return this.prisma.myUsers.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        firstName: true,
        lastName: true,
        mobile: true,
        role: true,
        status: true,
        image_name: true,
      },
    });
  }
  async findUserDetail(id: string) {
    return this.prisma.myUsers.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        firstName: true,
        lastName: true,
        mobile: true,
        role: true,
        status: true,
        image_name: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.myUsers.update({
      data: updateUserDto,
      where: {
        id,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        firstName: true,
        lastName: true,
        mobile: true,
        role: true,
        status: true,
        image_name: true,
      },
    });
  }
  async delete(id: string) {
    return this.prisma.myUsers.delete({
      where: {
        id,
      },
    });
  }
}
