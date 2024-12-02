import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class CreateColorVariationImagesDto {
    @ApiProperty()
    @IsNotEmpty()
    color_variation_id: string;

    image_url?: string;
    
    file?: any;
}