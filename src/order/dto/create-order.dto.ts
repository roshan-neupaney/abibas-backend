import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus, ShippingStatus } from "@prisma/client";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateOrderItemsDto } from "./create-order-items.dto";

export class CreateOrderDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstName: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    province: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    district: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    municipality: string;

    @ApiProperty()
    @IsOptional()
    ward?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    total_amount: string;
    
    @ApiProperty()
    @IsOptional()
    tax_amount?: string;
    
    @ApiProperty()
    status?: OrderStatus;
    
    @ApiProperty()
    shipping_status?: ShippingStatus;
    
    user_id?: string;

    @ApiProperty()
    orderItems: Array<CreateOrderItemsDto>
    
    
}
