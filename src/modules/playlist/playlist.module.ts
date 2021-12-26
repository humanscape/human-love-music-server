import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Playlist } from './playlist.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Playlist])],
})
export class PlaylistModule {}
