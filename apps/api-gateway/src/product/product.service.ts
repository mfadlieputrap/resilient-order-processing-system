import { Injectable } from '@nestjs/common';
import { ProductClient } from '../clients/product.client';
import { lastValueFrom } from 'rxjs';
import { ProductResponseDto } from '@app/shared/dto/product/product-response.dto';
import { CreateProductDto } from '@app/shared/dto/product/create-product.dto';
import { OrderCreatedEvent } from '@app/shared/events/order-created.event';

@Injectable()
export class ProductService {
  constructor(private readonly productClient: ProductClient) {}

  async createProduct(
    dto: CreateProductDto,
    withKafka: boolean,
  ): Promise<ProductResponseDto> {
    const res = await lastValueFrom(
      withKafka
        ? this.productClient.createWithKafka(dto)
        : this.productClient.createRestOnly(dto),
    );

    return res.data;
  }

  async findAllProducts(): Promise<ProductResponseDto[]> {
    const res = await lastValueFrom(this.productClient.findAll());
    return res.data;
  }

  async findProductById(productId: string): Promise<ProductResponseDto | null> {
    const res = await lastValueFrom(this.productClient.findById(productId));
    return res.data;
  }

  async updateStock(dto: OrderCreatedEvent): Promise<any> {
    const res = await lastValueFrom(this.productClient.updateStock(dto));
    return res.data;
  }
}
