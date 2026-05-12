import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrafficController } from './traffic.controller';
import { TrafficService } from './traffic.service';
import { Zone } from './entities/zone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Zone])],
  controllers: [TrafficController],
  providers: [TrafficService],
  exports: [TrafficService],
})
export class TrafficModule {}
