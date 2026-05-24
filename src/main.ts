import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.getHttpAdapter().getInstance().disable('x-powered-by');

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

  const config = new DocumentBuilder()
        .setTitle('TORCHLIFE API')
        .setDescription('API documentation for TORCHLIFE project')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            'access-token',
        )
        .addTag('auth', 'Operations about auth')
        .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const allowedOrigins = new Set<string>([
    ...(process.env.CORS_PROD ? [process.env.CORS_PROD] : []),
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
  ]);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  });

  console.log('✅ App initialized. Listening soon...');
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log('Server listening successfully, running on PORT:', process.env.PORT || 3000);
}
bootstrap();
