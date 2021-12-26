import { PrimaryKey } from '@mikro-orm/core';
import { nanoid } from 'nanoid';

export abstract class EntityBase {
  @PrimaryKey()
  id: string = nanoid(15);
}
