import { Injectable } from '@nestjs/common';
import { GetIndexResponseDto } from './dto/get-index-response.dto';

@Injectable()
export class AppService {
  getIndex(): GetIndexResponseDto {
    const currentUrl = process.env.DOCS_URL || 'http://localhost:3000/docs';

    return {
      name: 'Auth Learn NestJS',
      description: 'A simple authentication service built with NestJS',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      docsUrl: currentUrl,
    };
  }
}
