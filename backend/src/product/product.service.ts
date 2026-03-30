import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { Repository, IsNull, Like, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { FilterProductDto } from "./dto/filter-product.dto";
import { BadRequestException } from '@nestjs/common';
@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private repo: Repository<Product>,
    ) {}

    async create(dto: CreateProductDto){
        if(!dto.unitPrice || !dto.quantity) {
            throw new BadRequestException('unitPrice and quantity are required.');
        }
        
        // Calculate totalPrice from unitPrice * quantity
        const totalPrice = Number((dto.unitPrice * dto.quantity).toFixed(2));
        
        // Validate totalDiscount doesn't exceed totalPrice
        if(dto.totalDiscount && dto.totalDiscount > totalPrice) {
            throw new BadRequestException('Discount cannot exceed total price.');
        }

        const product = this.repo.create({
            ...dto,
            totalPrice,
            totalDiscount: dto.totalDiscount || 0,
        });
        return this.repo.save(product);
    }

    async findAll(filter?: FilterProductDto) {
        const where: any = { deletedAt: IsNull() };

        // Build filter conditions
        if (filter) {
            if (filter.title) {
                where.title = Like(`%${filter.title}%`);
            }
            if (filter.description) {
                where.description = Like(`%${filter.description}%`);
            }
            if (filter.quantity !== undefined) {
                where.quantity = filter.quantity;
            }
            if (filter.totalPrice !== undefined) {
                where.totalPrice = filter.totalPrice;
            }
            if (filter.totalDiscount !== undefined) {
                where.totalDiscount = filter.totalDiscount;
            }
            if (filter.orderId !== undefined) {
                where.orderId = filter.orderId;
            }
        }

        // Build query
        let query = this.repo.createQueryBuilder('product')
            .where('product.deletedAt IS NULL');

        // Apply filters
        if (filter?.title) {
            query = query.andWhere('product.title ILIKE :title', { title: `%${filter.title}%` });
        }
        if (filter?.description) {
            query = query.andWhere('product.description ILIKE :description', { description: `%${filter.description}%` });
        }
        if (filter?.quantity !== undefined) {
            query = query.andWhere('product.quantity = :quantity', { quantity: filter.quantity });
        }
        if (filter?.unitPrice !== undefined) {
            query = query.andWhere('product.unitPrice = :unitPrice', { unitPrice: filter.unitPrice });
        }
        if (filter?.totalPrice !== undefined) {
            query = query.andWhere('product.totalPrice = :totalPrice', { totalPrice: filter.totalPrice });
        }
        if (filter?.totalDiscount !== undefined) {
            query = query.andWhere('product.totalDiscount = :totalDiscount', { totalDiscount: filter.totalDiscount });
        }
        if (filter?.orderId !== undefined) {
            query = query.andWhere('product.orderId = :orderId', { orderId: filter.orderId });
        }

        // Apply sorting
        if (filter?.sortBy) {
            const validColumns = ['id', 'title', 'quantity', 'unitPrice', 'totalPrice', 'totalDiscount', 'orderId', 'createdAt'];
            const sortColumn = validColumns.includes(filter.sortBy) ? filter.sortBy : 'id';
            const sortOrder = filter.sortOrder || 'ASC';
            query = query.orderBy(`product.${sortColumn}`, sortOrder);
        } else {
            query = query.orderBy('product.id', 'ASC');
        }

        // Apply pagination
        if (filter?.limit) {
            query = query.take(filter.limit);
        }
        if (filter?.offset) {
            query = query.skip(filter.offset);
        }

        return query.getMany();
    }

   async findOne(id: number) {
    const product = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });

    if (!product) {
        throw new NotFoundException('Product not found');
    }

    return product;
}

    async softDelete(id: number) {
    console.log('Deleting ID:', id);

    const result = await this.repo.softDelete(id);
    console.log(result);

    return result;
}

    async restore(id: number) {
    const product = await this.repo.findOne({
        where: { id },
        withDeleted: true,
    });

    if (!product) {
        throw new NotFoundException('Product not found');
    }

    return this.repo.restore(id);
}

    async update(id: number, dto: UpdateProductDto) {
        const product = await this.findOne(id);

        // If unitPrice or quantity is being updated, recalculate totalPrice
        const unitPrice = dto.unitPrice ?? product.unitPrice;
        const quantity = dto.quantity ?? product.quantity;
        let totalPrice = product.totalPrice;

        if (dto.unitPrice !== undefined || dto.quantity !== undefined) {
            totalPrice = Number((unitPrice * quantity).toFixed(2));
        }

        const totalDiscount = dto.totalDiscount ?? product.totalDiscount;

        // Validate totalDiscount doesn't exceed totalPrice
        if (totalDiscount > totalPrice) {
            throw new BadRequestException('Discount cannot exceed total price.');
        }

        Object.assign(product, dto, { totalPrice });
        return this.repo.save(product);
    }
}