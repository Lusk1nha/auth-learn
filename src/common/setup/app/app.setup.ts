import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

interface IApplicationConfig {
  origins?: string[];
}

export function setupApp(
  app: INestApplication,
  logger: Logger,
  config?: IApplicationConfig,
): void {
  logger.log('Setting up application...');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: config?.origins || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.use(helmet());
  app.enableShutdownHooks();

  logger.log('Application setup complete.');
}
