import { SlackService } from '@modules/slack';
import {
  EnvelopedEvent,
  GenericMessage,
  isMessageChangedEvent,
  MessageEvent,
} from '@modules/slack/types';
import { Track } from '@modules/track/track.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RadioRepository } from './radio.repository';

const QUEUE_COMMAND = '#큐';

@Injectable()
export class RadioQueueService {
  constructor(
    private readonly slackService: SlackService,
    private readonly configService: ConfigService,
    private readonly radioRepository: RadioRepository,
  ) {}

  async addToQueue(body: EnvelopedEvent<MessageEvent>) {
    const { event } = body;
    if (!isMessageChangedEvent(event)) {
      return;
    }

    const { message, channel } = event;
    const allowedChannel =
      this.configService.get<string>('SLACK_QUEUE_ALLOW_CHANNEL') || '';
    const isMessageWithMusic =
      (!message.edited &&
        channel === allowedChannel &&
        message.text?.includes(QUEUE_COMMAND) &&
        !!this.slackService.findFirstMusicFromMessage(
          message as GenericMessage,
        )) ??
      false;
    if (!isMessageWithMusic) {
      return;
    }

    const summary = await this.slackService.summarizeMessageWithMusic(
      message as GenericMessage,
    );
    if (!summary) {
      throw new Error('Cannot get message summary');
    }

    const radio = await this.radioRepository.findOneOrFail(
      { roomName: 'main' },
      { populate: ['playlist.tracks'] },
    );
    const playlist = radio.playlist.unwrap();
    const currentTracks = playlist.tracks.getItems();

    const position = currentTracks.length
      ? currentTracks[currentTracks.length - 1].position + 1
      : 1;
    const track = new Track();
    track.sourceProvider = this.slackService.mapServiceProvider(
      summary.musicService,
    );
    track.sourceUrl = summary.musicUrl;
    track.position = position;
    track.title = summary.musicTitle;
    track.body = summary.text;
    track.author = summary.author;

    playlist.tracks.add(track);
    await this.radioRepository.persistAndFlush(radio);

    /**
     * TODO:
     * - check tracks with same url exists
     * - update radio context
     * - publish message and schedule jobs
     */
    return;
  }
}
