import {
  Entity,
  IdentifiedReference,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Playlist } from '@modules/playlist/playlist.entity';
import { EntityBase } from 'src/infrastructure/database/base-classes/orm.entity.base';

@Entity()
export class Radio extends EntityBase {
  @Unique()
  @Property()
  roomName!: string;

  @OneToOne({ entity: () => Playlist, wrappedReference: true })
  playlist!: IdentifiedReference<Playlist>;

  @Property({ nullable: true })
  currentTrackId?: string;

  @Property({ nullable: true })
  currentTrackStartedAt?: Date;

  @Property({ nullable: true })
  currentTrackDuration?: number;
}
