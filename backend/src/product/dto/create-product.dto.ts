import { IsNotEmpty,IsOptional,IsString,IsInt,Min, IsNumber, MaxLength, isString } from "class-validator";
import { Type } from 'class-transformer';
export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @Type(() => Number)
@IsInt()
@Min(1)
quantity: number;

@Type(() => Number)
@IsNumber()
@Min(0)
unitPrice: number;

@Type(() => Number)
@IsNumber()
@Min(0)
totalDiscount: number;

@Type(() => Number)
@IsInt()
orderId: number;
}
