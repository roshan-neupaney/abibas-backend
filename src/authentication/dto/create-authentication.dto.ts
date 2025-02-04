import { IsNotEmpty } from "class-validator";
import { Role } from "../role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAuthenticationDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly lastName: string;
    
    @ApiProperty()
    @IsNotEmpty()
    readonly mobile: string;

    role: Role;
}
