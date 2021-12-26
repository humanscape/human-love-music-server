import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Track } from './track.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Track])],
})
export class TrackModule {}
