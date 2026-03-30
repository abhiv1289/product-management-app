import { IsOptional, IsString, IsInt, Min, IsNumber, MaxLength } from "class-validator";
import { Type } from 'class-transformer';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    quantity?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    unitPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    totalDiscount?: number;
}
