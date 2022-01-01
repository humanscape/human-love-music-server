import { SlackService } from '@modules/slack';
import { TrackSourceProvider } from '@modules/track/enums';
import { Track } from '@modules/track/track.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import urlParser from 'js-video-url-parser';
import { PageRequest, PageResponse } from 'src/interface-adapters/dtos';
import {
  CreateDigestRequest,
  DigestResponse,
  DigestTrackResponse,
} from './dtos';
import { PlaylistType } from './enums';
import { Playlist } from './playlist.entity';
import { PlaylistRepository } from './playlist.repository';

export interface MessageSummery {
  author: string;
  text: string;
  musicService: string;
  musicUrl: string;
  musicTitle: string;
  reactionCount: number;
}

@Injectable()
export class DigestService {
  constructor(
    private readonly slackService: SlackService,
    private readonly configService: ConfigService,
    private readonly playlistRepo: PlaylistRepository,
  ) {}

  async get(id: string): Promise<DigestResponse> {
    const digest = await this.playlistRepo.findOne({ id });
    if (!digest) {
      throw new NotFoundException(`Digest not found by id: ${id}`);
    }
    return DigestResponse.fromEntity(digest);
  }

  async getMany(input: PageRequest): Promise<PageResponse<DigestResponse>> {
    const [digests, count] = await this.playlistRepo.findAndCount(
      { playlistType: PlaylistType.DIGEST },
      {
        offset: (input.page - 1) * input.size,
        limit: input.size,
        orderBy: { createdAt: 'desc' },
      },
    );
    return new PageResponse({
      data: digests.map((it) => DigestResponse.fromEntity(it)),
      total: count,
      size: input.size,
      page: input.page,
    });
  }

  async getTracks(id: string): Promise<DigestTrackResponse[]> {
    const digest = await this.playlistRepo.findOne({ id });
    if (!digest) {
      throw new NotFoundException(`Digest not found by id: ${id}`);
    }
    return (await digest.tracks.loadItems()).map((it) =>
      DigestTrackResponse.fromEntity(it),
    );
  }

  async create(body: CreateDigestRequest): Promise<DigestResponse> {
    const convertToSlackTs = (date: Date) => (date.getTime() / 1000).toString();
    const conversationRes = await this.slackService.conversations.history({
      channel:
        this.configService.get<string>('SLACK_DIGEST_TARGET_CHANNEL') || '',
      oldest: convertToSlackTs(body.from),
      latest: convertToSlackTs(body.to),
    });
    if (conversationRes.error) {
      throw new Error(conversationRes.error);
    }

    const { messages, has_more } = conversationRes;
    if (!messages || !messages.length) {
      throw new Error('No message found');
    }
    // TODO: 메시지 수가 많은 경우 잘라서 처리 필요
    if (has_more) {
      console.warn('Exceed Slack pagination size');
    }

    const memberIdMap = await this.slackService.getMemberSlackIdMap();
    const messagesWithMusic = messages.reduce((total, message) => {
      const initialMusic = message.attachments?.find(
        (it) =>
          it.service_name &&
          ['YouTube', 'SoundCloud'].includes(it.service_name) &&
          this.isSupportedMusicUrl(it.original_url),
      );
      if (!initialMusic) {
        return total;
      }

      const text =
        message.blocks
          ?.find((it) => it.type === 'rich_text')
          ?.elements?.find((it) => it.type === 'rich_text_section')
          // @ts-ignore: Element.elements가 존재하는데 타이핑이 잘못됨
          ?.elements?.find((it) => it.type === 'text')
          ?.text?.trim() ?? '';
      const reactionCount =
        message.reactions?.reduce((sum, cur) => sum + (cur.count ?? 0), 0) ?? 0;
      const summary: MessageSummery = {
        author: memberIdMap.get(message.user ?? '')?.name ?? 'undefined',
        text: text,
        musicService: initialMusic.service_name!,
        musicUrl: this.hydrateSupportedMusicUrl(initialMusic.original_url),
        musicTitle: initialMusic.title!,
        reactionCount,
      };
      return [...total, summary];
    }, [] as MessageSummery[]);
    const topMessages = messagesWithMusic
      .sort((a, b) => b.reactionCount - a.reactionCount)
      .slice(0, 10);

    const digest = new Playlist();
    digest.playlistType = PlaylistType.DIGEST;
    digest.title = body.title;
    digest.description = body.description;
    digest.tracks.set(
      topMessages.map((it, index) => {
        const track = new Track();
        track.sourceProvider = this.mapServiceProvider(it.musicService);
        track.sourceUrl = it.musicUrl;
        track.position = index + 1;
        track.title = it.musicTitle;
        track.body = it.text;
        track.author = it.author;
        return track;
      }),
    );
    await this.playlistRepo.persistAndFlush(digest);
    return DigestResponse.fromEntity(digest);
  }

  private isSupportedMusicUrl(url: string | undefined) {
    if (!url) {
      return false;
    }
    const parsed = urlParser.parse(url);
    if (!parsed) {
      return false;
    }
    if (!['video', 'track'].includes(parsed.mediaType || '')) {
      return false;
    }
    return true;
  }

  private hydrateSupportedMusicUrl(url: string | undefined) {
    if (!this.isSupportedMusicUrl(url)) {
      throw new Error('Not supported music url');
    }
    const hydrated = urlParser.create({ videoInfo: urlParser.parse(url!)! });
    if (!hydrated) {
      throw new Error('Cannot hydrate url');
    }
    return hydrated;
  }

  private mapServiceProvider(name: string) {
    const map: Record<string, TrackSourceProvider> = {
      YouTube: TrackSourceProvider.YOUTUBE,
      SoundCloud: TrackSourceProvider.SOUNDCLOUD,
    };
    const provider = map[name];
    if (!provider) {
      throw new Error('Cannot map service provider');
    }
    return provider;
  }
}
