import { EnvelopedEvent, MessageEvent } from '@modules/slack/types';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RadioResponse, RadioTrackResponse } from './dto';
import { RadioQueueService } from './radio-queue.service';
import { RadioService } from './radio.service';

@Controller('radios')
export class RadioController {
  constructor(
    private readonly radioService: RadioService,
    private readonly radioQueueService: RadioQueueService,
  ) {}

  @Get(':roomName')
  getByRoomName(@Param('roomName') roomName: string): Promise<RadioResponse> {
    return this.radioService.getByRoomName(roomName);
  }

  @Get(':roomName/tracks')
  getTracksByRoomName(
    @Param('roomName') roomName: string,
  ): Promise<RadioTrackResponse[]> {
    return this.radioService.getTracksByRoomName(roomName);
  }

  @Post('queues')
  handleMessage(@Body() body: EnvelopedEvent<MessageEvent>) {
    if (body.type === 'url_verification') {
      return { challenge: body.challenge };
    }
    return this.radioQueueService.addToQueue(body);
  }
}
