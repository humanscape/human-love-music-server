import {
  Entity,
  Enum,
  IdentifiedReference,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Playlist } from '@modules/playlist/playlist.entity';
import { DateAuditEntityBase } from 'src/infrastructure/database/base-classes/orm-date-audit.entity.base';
import { TrackSourceProvider } from './enums';

@Entity()
@Unique({ properties: ['playlist', 'position'] })
export class Track extends DateAuditEntityBase {
  @Enum(() => TrackSourceProvider)
  sourceProvider!: TrackSourceProvider;

  @Property()
  sourceUrl!: string;

  @Property()
  position!: number;

  @Property()
  title!: string;

  @Property({ nullable: true })
  body?: string;

  @Property()
  author!: string;

  @ManyToOne({ entity: () => Playlist, wrappedReference: true })
  playlist!: IdentifiedReference<Playlist>;
}
