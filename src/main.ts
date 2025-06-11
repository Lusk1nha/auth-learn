import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

import { setupApp } from './common/setup/app/app.setup';
import { setupSwagger } from './common/setup/swagger/swagger.setup';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const environment = process.env.NODE_ENV || 'development';

  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const logger = new Logger('Bootstrap');

  setupApp(app, logger);
  setupSwagger(app, logger);

  await app.listen(port, '0.0.0.0');
  logger.log(`Application is running on path: ${await app.getUrl()}/api/v1`);
  logger.log(`Application is running on environment: ${environment}`);
}
bootstrap().catch((err) => {
  new Logger('Bootstrap').error('Failed to start application', err.stack);
  process.exit(1);
});
