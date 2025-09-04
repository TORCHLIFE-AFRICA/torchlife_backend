import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.getHttpAdapter().getInstance().disable('x-powered-by');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, stopAtFirstError: true }));
    const config = new DocumentBuilder()
        .setTitle('TORCHLIFE API')
        .setDescription('API documentation for TORCHLIFE project')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 5040);
}
bootstrap();
