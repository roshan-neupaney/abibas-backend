import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCartDto {
    @ApiProperty()
    @IsNotEmpty()
    shoe_id: string;

    @ApiProperty()
    @IsNotEmpty()
    size: string;
    
    @ApiProperty()
    @IsNotEmpty()
    color_variation_id: string;
    
    user_id: string;
    
    @ApiProperty()
    count: number;
}