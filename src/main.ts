import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
<<<<<<< HEAD
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.getHttpAdapter().getInstance().disable('x-powered-by');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, stopAtFirstError: true }));
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
=======
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.getHttpAdapter().getInstance().disable('x-powered-by');
>>>>>>> fc3dc30458f5664de1a02fa12a4fd04f3655fa86

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

<<<<<<< HEAD
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  app.getHttpAdapter().getInstance().disable('x-powered-by');
=======
  const config = new DocumentBuilder()
    .setTitle('TorchLife Backend API')
    .setDescription(
      'Professional production-grade API for TorchLife platform. Supports campaigns, secure payments via Paystack, medical document verification, and user authentication.',
    )
    .setVersion('1.0.0')
    .setContact('TorchLife Engineering', 'https://torchlife.co', 'info@torchlife.com')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .addTag('Auth', 'Authentication and account management')
    .addTag('Campaigns', 'Crowdfunding campaigns and urgency-based discovery')
    .addTag('Payments', 'Paystack payment initialization and webhook handling')
    .addTag('Uploads', 'Medical and proof document management via Cloudinary')
    .addTag('Admin', 'Internal administrative and verification workflows')
    .build();
>>>>>>> fc3dc30458f5664de1a02fa12a4fd04f3655fa86

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      displayRequestDuration: true,
    },
    customSiteTitle: 'TorchLife API Documentation',
  });

  const allowedOrigins = new Set<string>([
    ...(process.env.CORS_PROD ? [process.env.CORS_PROD] : []),
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'https://torchlife.co',
    'https://torchlife-backend-3lnl.onrender.com',

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
