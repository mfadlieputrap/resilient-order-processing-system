import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from '../../../libs/shared/src/dto/product/create-product.dto';
import { ProductResponseDto } from '../../../libs/shared/src/dto/product/product-response.dto';
import { OrderCreatedEvent } from '@app/shared/events/order-created.event';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('with-kafka')
  async createProductWithKafka(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.createProduct(createProductDto, true);
  }

  @Post('rest-only')
  async createProductRestOnly(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.createProduct(createProductDto, false);
  }

  @Post('update-stock')
  async handleOrderCreated(@Body() dto: OrderCreatedEvent) {
    return this.productService.handleOrderCreated(dto);
  }

  @Get()
  async findAllProducts(): Promise<ProductResponseDto[]> {
    return this.productService.findAllProducts();
  }

  @Get(':id')
  async findProductById(
    @Param('id') id: string,
  ): Promise<ProductResponseDto | null> {
    return this.productService.findProductById(id);
  }
}
