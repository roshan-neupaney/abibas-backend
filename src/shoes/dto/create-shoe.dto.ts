import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { StatusEnum } from 'src/common/all.enum';

export class CreateShoeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  brand_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  details: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  previous_price: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: StatusEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  color_variation: any;


  @ApiProperty()
  deleteColorVariation?: [];
  @ApiProperty()
  deleteSizeVariation?: [];

  slug_url?: string;
}
