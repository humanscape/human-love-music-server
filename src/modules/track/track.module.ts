import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TrackInfoService } from './track-info.service';
import { Track } from './track.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Track])],
  providers: [TrackInfoService],
  exports: [TrackInfoService],
})
export class TrackModule {}
