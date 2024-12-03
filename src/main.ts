import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

config({
  path:
    process.env.NODE_ENV === 'development' ? '.env.development' : '.env.prod',
});
const server = express();

async function bootstrap() {
  if (process.env.STORAGE === 'cloudinary') {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('Cloudinary configuration has been initialized.');
  }
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );

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
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap();

export default server;
