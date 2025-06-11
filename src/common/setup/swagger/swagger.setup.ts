import { INestApplication, Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import Swagger from 'src/common/swagger/swagger.common';

export function setupSwagger(app: INestApplication, logger: Logger): void {
  logger.log('Setting up Swagger documentation...');

  const swagger = new Swagger();
  const document = SwaggerModule.createDocument(app, swagger.config());

  SwaggerModule.setup(swagger.tag, app, document, {
    swaggerOptions: {
      persistAuthorization: false,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Link Sharing API Docs',
    jsonDocumentUrl: 'api-docs/json',
  });

  logger.log('Swagger documentation setup complete.');
}
