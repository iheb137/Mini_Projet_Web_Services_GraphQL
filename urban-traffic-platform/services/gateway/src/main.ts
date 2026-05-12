import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  // process.env.PORT will be set from our compose or local env file
  await app.listen(process.env.PORT || 3000);
  console.log(`Gateway is running on: ${await app.getUrl()}/graphql`);
}
bootstrap();
