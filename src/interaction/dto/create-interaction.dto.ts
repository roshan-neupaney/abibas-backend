import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateInteractionDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    shoe_id: string

    @ApiProperty()
    user_id: string
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    action_type: string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    interaction_score: number

    rate?: number;

}
