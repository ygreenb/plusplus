import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { StationRepository } from './station.repository';
import { ThemeRepository } from 'src/themes/theme.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StationRepository, ThemeRepository])],
  controllers: [StationsController],
  providers: [StationsService],
})
export class StationsModule {}
