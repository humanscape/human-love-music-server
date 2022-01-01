import { EnvelopedEvent, MessageEvent } from '@modules/slack/types';
import { Body, Controller, Post } from '@nestjs/common';
import { RadioQueueService } from './radio-queue.service';

@Controller('radios')
export class RadioController {
  constructor(private readonly radioQueueService: RadioQueueService) {}

  @Post('queues')
  handleMessage(@Body() body: EnvelopedEvent<MessageEvent>) {
    if (body.type === 'url_verification') {
      return { challenge: body.challenge };
    }
    return this.radioQueueService.addToQueue(body);
  }
}
