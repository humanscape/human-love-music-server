import { Entity, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class Hello {
  @PrimaryKey()
  id!: string;
}
