import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation and automatic body parsing
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.getHttpAdapter().getInstance().disable('x-powered-by');

  const config = new DocumentBuilder()
    .setTitle('TORCHLIFE API')
    .setDescription('API documentation for TORCHLIFE project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // const port = process.env.PORT || 3000;
  // await app.listen(port, '0.0.0.0');
  // console.log(`🚀 Server is running on http://0.0.0.0:${port}`);

  app.enableCors();
  console.log('✅ App initialized. Listening soon...');
  await app.listen(process.env.PORT || 10000, '0.0.0.0');
  console.log('🚀 Server listening successfully.');
}
bootstrap();