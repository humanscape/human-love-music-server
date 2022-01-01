import { TrackSourceProvider } from '@modules/track/enums';
import { Inject, Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import urlParser from 'js-video-url-parser';
import { SlackMember } from './slack-member.entity';
import { SlackMemberRepository } from './slack-member.repository';
import { SLACK_WEB_CLIENT } from './slack.constant';
import { GenericMessage, MessageWithMusicSummery } from './types';

@Injectable()
export class SlackService {
  constructor(
    @Inject(SLACK_WEB_CLIENT) private readonly client: WebClient,
    private readonly slackMemberRepository: SlackMemberRepository,
  ) {}

  get chat() {
    return this.client.chat;
  }

  get conversations() {
    return this.client.conversations;
  }

  get users() {
    return this.client.users;
  }

  getMemberList() {
    return this.slackMemberRepository.findAll();
  }

  async getMemberSlackIdMap() {
    const members = await this.slackMemberRepository.findAll();
    const map = new Map<string, SlackMember>();
    members.forEach((it) => {
      map.set(it.slackId, it);
    });
    return map;
  }

  getMemberBySlackId(slackId: string) {
    return this.slackMemberRepository.findOne({ slackId });
  }

  async updateMemberList() {
    const userRes = await this.users.list();
    if (userRes.error) {
      throw new Error(userRes.error);
    }
    const { members: slackMembers } = userRes;
    if (!slackMembers || !slackMembers.length) {
      throw new Error('No users exists');
    }
    if (!slackMembers.length) {
      return;
    }

    const existingMembers = await this.slackMemberRepository.findAll();
    existingMembers.forEach((it) => this.slackMemberRepository.remove(it));
    await this.slackMemberRepository.flush();

    const members = slackMembers
      .filter((it) => !it.is_bot && it.id)
      .map((it) => {
        const member = new SlackMember();
        member.slackId = it.id!;
        member.name = `@${it.name!}`;
        return member;
      });
    await this.slackMemberRepository.persistAndFlush(members);
  }

  findFirstMusicFromMessage(message: GenericMessage) {
    const initialMusic = message.attachments?.find(
      (it) =>
        it.service_name &&
        ['YouTube', 'SoundCloud'].includes(it.service_name) &&
        this.isSupportedMusicUrl(it.original_url),
    );
    return initialMusic ?? null;
  }

  async summarizeMessageWithMusic(
    message: GenericMessage,
  ): Promise<MessageWithMusicSummery | null> {
    const initialMusic = this.findFirstMusicFromMessage(message);
    if (!initialMusic) {
      return null;
    }
    return {
      text: this.retrieveFirstTextFromMessage(message),
      author:
        (
          await this.slackMemberRepository.findOne({
            slackId: message.user ?? '',
          })
        )?.name ?? 'undefined',
      musicService: initialMusic.service_name!,
      musicUrl: this.hydrateSupportedMusicUrl(initialMusic.original_url),
      musicTitle: initialMusic.title!,
      reactionCount: this.sumReactionsCountFromMessage(message),
    };
  }

  summarizeMessageWithMusicUsingMap(
    message: GenericMessage,
    memberSlackIdMap: Map<string, SlackMember>,
  ): MessageWithMusicSummery | null {
    const initialMusic = this.findFirstMusicFromMessage(message);
    if (!initialMusic) {
      return null;
    }
    return {
      text: this.retrieveFirstTextFromMessage(message),
      author: memberSlackIdMap.get(message.user ?? '')?.name ?? 'undefined',
      musicService: initialMusic.service_name!,
      musicUrl: this.hydrateSupportedMusicUrl(initialMusic.original_url),
      musicTitle: initialMusic.title!,
      reactionCount: this.sumReactionsCountFromMessage(message),
    };
  }

  mapServiceProvider(name: string) {
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

  private retrieveFirstTextFromMessage(message: GenericMessage) {
    const text =
      message.blocks
        ?.find((it) => it.type === 'rich_text')
        ?.elements?.find((it) => it.type === 'rich_text_section')
        // @ts-ignore: Element.elements가 존재하는데 타이핑이 잘못됨
        ?.elements?.find((it) => it.type === 'text')
        ?.text?.trim() ?? '';
    return text;
  }

  private sumReactionsCountFromMessage(message: GenericMessage) {
    return (
      message.reactions?.reduce((sum, cur) => sum + (cur.count ?? 0), 0) ?? 0
    );
  }
}
