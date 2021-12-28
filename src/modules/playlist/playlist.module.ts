import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DigestController } from './digest.controller';
import { DigestService } from './digest.service';
import { Playlist } from './playlist.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Playlist])],
  providers: [DigestService],
  controllers: [DigestController],
})
export class PlaylistModule {}
