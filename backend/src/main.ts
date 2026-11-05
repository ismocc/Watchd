import 'dotenv/config';
import { existsSync } from 'fs';
import { join } from 'path';
import { NextFunction, Request, Response } from 'express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  if (!process.env.JWT_SECRET || !process.env.TMDB_API_KEY) {
    throw new Error('JWT_SECRET and TMDB_API_KEY have to be set, see .env.example');
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // when deployed, the built angular app is in ./public and gets served from here too
  // so its all one server and no cors stuff
  const web = join(__dirname, '..', 'public');
  if (existsSync(web)) {
    app.useStaticAssets(web);
    // send index.html for page routes (/diary, /lists/3 etc) so refreshing works
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
      res.sendFile(join(web, 'index.html'));
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
