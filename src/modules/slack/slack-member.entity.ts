import { Entity, Property, Unique } from '@mikro-orm/core';
import { EntityBase } from 'src/infrastructure/database/base-classes/orm.entity.base';

@Entity()
export class SlackMember extends EntityBase {
  @Property()
  @Unique()
  slackId!: string;

  @Property()
  @Unique()
  name!: string;
}
