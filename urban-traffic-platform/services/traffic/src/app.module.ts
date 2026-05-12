import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrafficModule } from './traffic/traffic.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://traffic_user:traffic_password@db-traffic:5432/traffic_db',
      autoLoadEntities: true,
      synchronize: true, // Should be false in production
    }),
    TrafficModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
