import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RadioQueueService } from './radio-queue.service';
import { RadioController } from './radio.controller';
import { Radio } from './radio.entity';
import { RadioService } from './radio.service';

@Module({
  imports: [MikroOrmModule.forFeature([Radio])],
  providers: [RadioService, RadioQueueService],
  controllers: [RadioController],
})
export class RadioModule {}
