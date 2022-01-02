import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TrackModule } from '@modules/track/track.module';
import { Module } from '@nestjs/common';
import { RadioQueueService } from './radio-queue.service';
import { RadioController } from './radio.controller';
import { Radio } from './radio.entity';
import { RadioGateway } from './radio.gateway';
import { RadioService } from './radio.service';

@Module({
  imports: [MikroOrmModule.forFeature([Radio]), TrackModule],
  providers: [RadioService, RadioQueueService, RadioGateway],
  controllers: [RadioController],
})
export class RadioModule {}
