import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  shoe_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Rating must be a positive number' })
  rate: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  review: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  short_review: string;

  user_id: string
}
