import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { FilterProductDto } from "./dto/filter-product.dto";

@Controller('products')
export class ProductController {
    constructor(private readonly service: ProductService) {}

    @Post()
    create(@Body() dto: CreateProductDto){
       return this.service.create(dto);
    }

    @Get()
    findAll(@Query() filter: FilterProductDto) {
        return this.service.findAll(filter);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
  return this.service.findOne(id);
}

    @Delete(':id')
remove(@Param('id', ParseIntPipe) id: number) {
  return this.service.softDelete(id);
}

    @Patch(':id')
update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
  return this.service.update(id, dto);
}

    @Patch(':id/restore')
restore(@Param('id', ParseIntPipe) id: number) {
  return this.service.restore(id);
}
}