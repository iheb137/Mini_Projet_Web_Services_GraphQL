import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsModule } from './incidents/incidents.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://incidents_user:incidents_password@db-incidents:5432/incidents_db',
      autoLoadEntities: true,
      synchronize: true, // Should be false in production
    }),
    IncidentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
