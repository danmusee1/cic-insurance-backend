/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import * as bodyParser from 'body-parser'; // Import body-parser for setting payload limits

import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    bodyParser: true,
  });
  

  // Increase payload size limit
  app.use(bodyParser.json({ limit: '50mb' })); // Adjust as necessary
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MyChoiceApp')
    .setDescription('ELECTION APP APIS')
    .setVersion('1.0')
    .addTag('elections')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  // Enable CORS
  app.enableCors({
    origin: [
      '*', 
      'http://localhost:3000', 
      'http://localhost:5173',
      'http://localhost:3001', 
      'https://automate-trade.com/', 
      'http://localhost:51688', 
      'http://46.202.129.249:3000'
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Serve static files from the 'uploads' directory
/*   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // This makes the files accessible at http://localhost:3333/uploads
  }); */
  // Add global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Set a custom JSON serialization for BigInt
  (BigInt.prototype as any).toJSON = function () {
    return Number(this);
  };

  const port = process.env.PORT || 3333;
  await app.listen(port);
  console.log(`Application is running on http://localhost:${port}`);
}

bootstrap();
