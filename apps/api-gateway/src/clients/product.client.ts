import { CreateProductDto } from '@app/shared/dto/product/create-product.dto';
import { ProductResponseDto } from '@app/shared/dto/product/product-response.dto';
import { OrderCreatedEvent } from '@app/shared/events/order-created.event';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductClient {
  private PRODUCT_SERVICE_URL: string;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.PRODUCT_SERVICE_URL =
      this.configService.get<string>('PRODUCT_SERVICE_URL') ||
      'http://product-service:3003';
  }

  createWithKafka(dto: CreateProductDto) {
    return this.http.post<ProductResponseDto>(
      `${this.PRODUCT_SERVICE_URL}/products/with-kafka`,
      dto,
    );
  }

  createRestOnly(dto: CreateProductDto) {
    return this.http.post<ProductResponseDto>(
      `${this.PRODUCT_SERVICE_URL}/products/rest-only`,
      dto,
    );
  }

  findAll() {
    return this.http.get<ProductResponseDto[]>(
      `${this.PRODUCT_SERVICE_URL}/products`,
    );
  }

  findById(productId: string) {
    return this.http.get<ProductResponseDto | null>(
      `${this.PRODUCT_SERVICE_URL}/products/${productId}`,
    );
  }

  updateStock(dto: OrderCreatedEvent) {
    return this.http.post(
      `${this.PRODUCT_SERVICE_URL}/products/update-stock`,
      dto,
    );
  }
}
