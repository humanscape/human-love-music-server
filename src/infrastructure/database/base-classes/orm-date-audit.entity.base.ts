import { Property } from '@mikro-orm/core';
import { EntityBase } from './orm.entity.base';

export abstract class DateAuditEntityBase extends EntityBase {
  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
