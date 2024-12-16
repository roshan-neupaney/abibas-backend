import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadImageWithNoSizes } from 'src/common/helper';

@Controller('brand')
@ApiTags('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let uploadedFile: any;
    if (file) {
      uploadedFile = await uploadImageWithNoSizes(file);
    }
    if (uploadedFile) {
      createBrandDto.image_name = uploadedFile.fileName;
    }
    return this.brandService.create(createBrandDto);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }
  @Get('/active')
  findAllActive() {
    return this.brandService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let uploadedFile: any;
    if (file) {
      uploadedFile = await uploadImageWithNoSizes(file);
    }
    if (uploadedFile) {
      updateBrandDto.image_name = uploadedFile.fileName;
    }
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
