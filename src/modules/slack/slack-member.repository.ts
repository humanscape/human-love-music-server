import { Repository } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { SlackMember } from './slack-member.entity';

@Repository(SlackMember)
export class SlackMemberRepository extends EntityRepository<SlackMember> {}
