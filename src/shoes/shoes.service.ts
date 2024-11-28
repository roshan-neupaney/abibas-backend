import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShoeDto } from './dto/create-shoe.dto';
import { UpdateShoeDto } from './dto/update-shoe.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShoesType } from './shoes.types';
import { join } from 'path';
import { unlink } from 'fs';
import { CreateCartDto } from './dto/create-cart.dto';
import { VariationDto } from './dto/create-variation.dto';
import { SizeDto } from './dto/create-size.dto';

@Injectable()
export class ShoesService {
  constructor(private prisma: PrismaService) {}
  async create(createShoeDto: CreateShoeDto, colorVariation: any) {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        delete createShoeDto['color_variation'];
        const slug_url =
          createShoeDto.title.replaceAll(' ', '_') +
          '_' +
          Math.floor(Math.random() * Date.now() * 0.0001).toString();
        const shoeResponse = await prisma.shoe.create({
          data: {
            title: createShoeDto.title,
            slug_url: slug_url,
            brand_id: createShoeDto.brand_id,
            category_id: createShoeDto.category_id,
            price: createShoeDto.price,
            previous_price: createShoeDto.previous_price,
            description: createShoeDto.description,
            details: createShoeDto.details,
            status: createShoeDto.status,
          },
        });

        for (const cv of colorVariation) {
          const cvResponse = await prisma.colorVariation.create({
            data: {
              color: JSON.parse(cv.color),
              image_url: cv.image_url,
              shoe_id: shoeResponse.id,
            },
          });
          for (const s of cv.sizes) {
            await prisma.size.create({
              data: {
                size: s.size,
                stock: s.stock,
                color_variation_id: cvResponse.id,
              },
            });
          }
        }
        return shoeResponse;
      });
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(query: ShoesType) {
    const { category, price_min, price_max, color } = query;
    const colorArray = color ? color.split(',') : [];
    const shoeList = await this.prisma.shoe.findMany({
      where: {
        category: {
          title: {
            contains: category,
          },
        },
        price: {
          gte: price_min,
          lte: price_max,
        },
        ...(colorArray.length > 0 && {
          colorVariation: {
            some: {
              color: {
                hasSome: colorArray,
              },
            },
          },
        }),
      },
      include: {
        category: true,
        colorVariation: true,
        brand: true,
        rating: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return shoeList;
  }

  async findOne(id: string, user_id: string) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const response = await prisma.shoe.findUnique({
        where: {
          slug_url: id,
        },
        include: {
          category: true,
          colorVariation: {
            include: {
              sizes: true,
            },
          },
          brand: true,
          rating: {
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              user: true,
            },
          },
        },
      });
      const favorite = await prisma.favorite.findFirst({
        where: {
          shoe_id: response.id,
          user_id,
        },
      });
      return { ...response, isFav: !!favorite };
    });
    return result;
  }

  async update(id: string, updateShoeDto: UpdateShoeDto, colorVariation: any) {
    delete updateShoeDto['color_variation'];
    const { deleteColorVariation, deleteSizeVariation } = updateShoeDto;
    const result = await this.prisma.$transaction(async (prisma) => {
      const shoeResponse = await prisma.shoe.update({
        where: { slug_url: id },
        data: {
          title: updateShoeDto.title,
          brand_id: updateShoeDto.brand_id,
          price: updateShoeDto.price,
          previous_price: updateShoeDto.previous_price,
          description: updateShoeDto.description,
          category_id: updateShoeDto.category_id,
          details: updateShoeDto.details,
          status: updateShoeDto.status,
        },
      });
      if (deleteColorVariation?.length > 0) {
        for (const item of deleteColorVariation) {
          await prisma.colorVariation.delete({ where: { id: item } });
        }
      }
      if (deleteSizeVariation?.length > 0) {
        for (const item of deleteSizeVariation) {
          await prisma.size.delete({ where: { id: item } });
        }
      }
      const colorVariationResponse = await Promise.all(
        colorVariation.map(async (cv: VariationDto) => {
          if (cv.id) {
            const existingImage = await prisma.colorVariation.findUnique({
              where: { id: cv.id },
            });
            if (existingImage && !(existingImage.image_url === cv.image_url)) {
              const existingImagePath = join(
                './public',
                'uploads',
                'images',
                existingImage.image_url,
              );
              unlink(existingImagePath, (error) => {
                if (error) return 'Error while updating shoe';
              });
            }
            const resCV = await prisma.colorVariation.update({
              where: {
                id: cv.id,
              },
              data: {
                color: JSON?.parse(cv?.color),
                image_url: cv.image_url,
              },
            });
            const resSize = await Promise.all(
              cv.sizes.map(async (s: SizeDto) => {
                if (s.id) {
                  return await prisma.size.update({
                    where: {
                      id: s.id,
                    },
                    data: {
                      size: s.size,
                      stock: s.stock,
                    },
                  });
                } else {
                  return await prisma.size.create({
                    data: {
                      size: s.size,
                      stock: s.stock,
                      color_variation_id: resCV.id,
                    },
                  });
                }
              }),
            );
            return { ...resCV, sizes: resSize };
          } else {
            const resCV = await prisma.colorVariation.create({
              data: {
                color: JSON.parse(cv.color),
                image_url: cv.image_url,
                shoe_id: shoeResponse.id,
              },
            });
            const resSize = await Promise.all(
              cv.sizes.map(async (s: SizeDto) => {
                return await prisma.size.create({
                  data: {
                    size: s.size,
                    stock: s.stock,
                    color_variation_id: resCV.id,
                  },
                });
              }),
            );
            return { ...resCV, sizes: resSize };
          }
        }),
      );
      return { ...shoeResponse, colorVariation: colorVariationResponse };
    });
    return result;
  }

  remove(id: string) {
    return this.prisma.shoe.delete({
      where: {
        id,
      },
    });
  }

  async createCart(createCartDto: CreateCartDto) {
    return await this.prisma.$transaction(async (prisma) => {
      const { user_id, shoe_id, size, color_variation_id } = createCartDto;
      // console.log(user_id)
      const existingProduct = await prisma.cart.findFirst({
        where: {
          user_id,
          shoe_id,
          size,
          color_variation_id,
        },
      });
      if (existingProduct) {
        return await prisma.cart.update({
          data: {
            count: existingProduct.count + 1,
          },
          where: {
            id: existingProduct.id,
          },
        });
      } else {
        return await prisma.cart.create({
          data: {
            shoe_id,
            size,
            color_variation_id,
            user_id,
          },
        });
      }
    });
  }

  async changeCartProductQuantity(id: string, quantity: number) {
    return await this.prisma.cart.update({
      data: {
        count: quantity,
      },
      where: {
        id: id,
      },
    });
  }

  async findUserCart(user_id: string) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const cartResponse = await prisma.cart.findMany({
        where: {
          user_id,
        },
        select: {
          id: true,
          size: true,
          count: true,
          createdAt: true,
          shoe: {
            select: {
              id: true,
              title: true,
              price: true,
            },
          },
          colorVariation: {
            select: {
              id: true,
              color: true,
              image_url: true,
              sizes: true,
            },
          },
          color_variation_id: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      const finalResponse = await Promise.all(
        cartResponse.map(async (cart) => {
          const favorite = await prisma.favorite.findFirst({
            where: {
              shoe_id: cart.shoe.id,
              user_id,
            },
          });
          const stock = cart.colorVariation.sizes.filter(
            (s) => s.size === cart.size,
          )[0];
          return { ...cart, isFav: !!favorite, stock: stock.stock };
        }),
      );
      return finalResponse;
    });
    return result;
  }

  async deleteCart(id: string) {
    return await this.prisma.cart.delete({ where: { id } });
  }

  async createFavorites(shoe_id: string, user_id: string) {
    const existingFavorite = await this.prisma.favorite.findFirst({
      where: { shoe_id, user_id },
    });
    if (existingFavorite) {
      return await this.prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
    } else {
      return await this.prisma.favorite.create({
        data: {
          shoe_id,
          user_id,
        },
      });
    }
  }
  async findAllFavorites(userId: string) {
    return await this.prisma.favorite.findMany({
      where: {
        user_id: userId,
      },
      select: {
        id: true,
        shoe: true,
      },
    });
  }
}
