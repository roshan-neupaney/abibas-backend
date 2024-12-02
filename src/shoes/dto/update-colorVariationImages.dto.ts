import { PartialType } from '@nestjs/swagger';
import { CreateColorVariationImagesDto } from './create-colorVariationImages.dto';

export class UpdateColorVariationImagesDto extends PartialType(CreateColorVariationImagesDto) {}
