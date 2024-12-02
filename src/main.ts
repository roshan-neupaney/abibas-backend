import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { config } from 'dotenv';
import { Logger } from '@nestjs/common';

config({ path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env.prod' });
const server = express();

async function bootstrap() {
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(server));

 
  if (process.env.NODE_ENV === 'production') {
    // Production-specific logic
    console.log('production')
  } else {
    // Development-specific logic
    console.log('dev')
  }

  const logger = new Logger('VercelLogger');
logger.error('An error occurred while processing the request.')

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearer',
    )
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.useStaticAssets(path.join(__dirname, '../public/uploads'));
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.enableCors();
  const port = process.env.PORT || 3001;
  await app.listen(port);
  // await app.init();
}
bootstrap();

export default server;
