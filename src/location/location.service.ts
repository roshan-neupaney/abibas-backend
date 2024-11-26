import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async create(jsonData) {
    const createdProvinces = [];

    for (const province of jsonData) {
      const createdProvince = await this.prisma.province.create({
        data: {
          name: province.name,
          areaSqKm: province.area_sq_km,
          website: province.website,
          headquarter: province.headquarter,
          districts: {
            create: Object.values(province.districts).map((district: any) => ({
              name: district.name,
              areaSqKm: district.area_sq_km,
              website: district.website,
              headquarter: district.headquarter,
              municipalities: {
                create: Object.values(district.municipalities).map(
                  (municipality: any) => ({
                    categoryId: municipality.category_id,
                    name: municipality.name,
                    areaSqKm: municipality.area_sq_km,
                    website: municipality.website,
                    wards: municipality.wards,
                  }),
                ),
              },
            })),
          },
        },
        include: {
          districts: {
            include: {municipalities: true}
          }
        }
      });
      createdProvinces.push(createdProvince);
    }
    return createdProvinces;
  }

  async findAll() {
    return await this.prisma.province.findMany({
      include: {
        districts: {
          include: {municipalities: true}
        }
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
