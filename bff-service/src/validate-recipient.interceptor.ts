import {
  Injectable,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { basePath } from './base-path.const';

@Injectable()
export class ValidateRecipientInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const pathSegments = request.url.split('/').filter(Boolean);
    const resourceType = pathSegments[1];
    if (!basePath[resourceType]) {
      throw new HttpException('Cannot process request', HttpStatus.BAD_GATEWAY);
    }
    return next.handle();
  }
}