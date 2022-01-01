import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RadioQueueService } from './radio-queue.service';
import { RadioController } from './radio.controller';
import { Radio } from './radio.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Radio])],
  providers: [RadioQueueService],
  controllers: [RadioController],
})
export class RadioModule {}
