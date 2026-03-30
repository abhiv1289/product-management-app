import { Entity , PrimaryGeneratedColumn , Column , CreateDateColumn , UpdateDateColumn,DeleteDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderId: number;

    @Column()
    title: string;

    @Column({nullable: true})
    description: string;

    @Column()
    quantity: number;

    @Column('decimal', {nullable: true, default: 0})
    unitPrice: number;

    @Column('decimal', {nullable: true, default: 0})
    totalPrice: number;

    @Column('decimal', {nullable: true, default: 0})
    totalDiscount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}