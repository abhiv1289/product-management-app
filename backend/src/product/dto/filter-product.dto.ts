import { IsOptional, IsString, IsNumber, Min, IsIn } from "class-validator";
import { Type } from 'class-transformer';

export class FilterProductDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    quantity?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    unitPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    totalPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    totalDiscount?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    orderId?: number;

    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC';

    @IsOptional()
    @Type(() => Number)
    @Min(1)
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    @Min(0)
    offset?: number;
}
