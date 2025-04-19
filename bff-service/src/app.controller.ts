import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Put, Req, UseInterceptors } from '@nestjs/common';
import { ValidateRecipientInterceptor } from './validate-recipient.interceptor';
import { HttpService } from '@nestjs/axios';
import { basePath } from './base-path.const';
import { catchError, throwError } from 'rxjs';
import { CartItem, CreateOrderDto } from './models';

@Controller('bff')
@UseInterceptors(ValidateRecipientInterceptor)
export class AppController {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  @Get('product')
  async getProduct() {
    this.httpService.get(basePath.product!).pipe(
      catchError((error) => throwError(() => (
        new HttpException(
          error.response?.data || 'Failed to fetch products',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        )
      )))
    );
  }

  @Put('product')
  async updateProduct() {
    this.httpService.put(basePath.product!).pipe(
      catchError((error) => throwError(() => (
        new HttpException(
          error.response?.data || 'Failed to update products',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        )
      )))
    );
  }

  @Delete('product/:id')
  async deleteProduct(@Param('id') id: string) {
    this.httpService.delete(`${basePath.product!}/${id}`).pipe(
      catchError((error) => throwError(() => (
        new HttpException(
          error.response?.data || 'Failed to delete product',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        )
      )))
    );
  }

  @Get('product/:id')
  async getProductById(@Param('id') id: string) {
    this.httpService.get(`${basePath.product!}/${id}`).pipe(
      catchError((error) => throwError(() => (
        new HttpException(
          error.response?.data || 'Failed to get product by id',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        )
      )))
    );
  }

  @Get('cart')
  async getProfileCart() {
    this.httpService.get(`${basePath.cart!}`).pipe(
      catchError((error) => throwError(() => (
        new HttpException(
          error.response?.data || 'Failed to get cart',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        )
      )))
    );
  }

  @Put('cart')
  async updateProfileCart(@Body() body: CartItem) {
    this.httpService.put(basePath.cart!, body).pipe(
      catchError((error) => throwError(() => (
        new HttpException(
          error.response?.data || 'Failed to update cart', 
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        )
      )))
    );
  }

  @Get('order')
  async getOrders() {
    this.httpService.delete(`${basePath.order!}`).pipe(
      catchError((error) => throwError(() => (
        new HttpException(
          error.response?.data || 'Failed to get order',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        )
      )))
    );
  }

  @Put('order')
  async updateOrders(@Body() body: CreateOrderDto) {
    this.httpService.put(basePath.order!, body).pipe(
      catchError((error) => throwError(() => (
        new HttpException(
          error.response?.data || 'Failed to update order',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        )
      )))
    );
  }

  @Get('order/:id')
  async getOrderById() {}

  @Delete('order/:id')
  async deleteOrderById() {}

  @Put('order/:id/status')
  async updateOrderStatus() {}

  @Get('*') 
  handleFallback(@Req() req: any) {
    throw new HttpException(
      {
        message: `Cannot process request for route: ${req.url}`,
      },
      HttpStatus.BAD_GATEWAY,
    );
  }
}
