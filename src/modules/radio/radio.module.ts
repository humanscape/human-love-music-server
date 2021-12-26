import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Radio } from './radio.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Radio])],
})
export class RadioModule {}
