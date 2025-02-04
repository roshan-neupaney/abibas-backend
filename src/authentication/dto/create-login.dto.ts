import { IsNotEmpty } from "class-validator";
import { Role } from "../role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateLoginDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly password: string;
    
    role: Role;
}