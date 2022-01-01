import { Inject, Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SlackMember } from './slack-member.entity';
import { SlackMemberRepository } from './slack-member.repository';
import { SLACK_WEB_CLIENT } from './slack.constant';

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
}
