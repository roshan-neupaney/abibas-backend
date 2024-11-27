import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderItemsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  price: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  size: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  shoe_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  color_variation_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  count: number;
}
