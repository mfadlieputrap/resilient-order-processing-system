import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from '@app/shared/dto/product/create-product.dto';
import { ProductResponseDto } from '@app/shared/dto/product/product-response.dto';
import { OrderCreatedEvent } from '@app/shared/events/order-created.event';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('with-kafka')
  createProductWithKafka(
    @Body() dto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.createProduct(dto, true);
  }

  @Post('rest-only')
  createProductRestOnly(
    @Body() dto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.createProduct(dto, false);
  }

  @Post('update-stock')
  updateStock(@Body() dto: OrderCreatedEvent) {
    return this.productService.updateStock(dto);
  }

  @Get()
  findAll(): Promise<ProductResponseDto[]> {
    return this.productService.findAllProducts();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<ProductResponseDto | null> {
    return this.productService.findProductById(id);
  }
}
