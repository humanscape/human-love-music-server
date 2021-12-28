import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  Property,
  QueryOrder,
} from '@mikro-orm/core';
import { Track } from '@modules/track/track.entity';
import { DateAuditEntityBase } from 'src/infrastructure/database/base-classes/orm-date-audit.entity.base';
import { PlaylistType } from './enums';

@Entity()
export class Playlist extends DateAuditEntityBase {
  @Enum(() => PlaylistType)
  playlistType!: PlaylistType;

  @Property()
  title!: string;

  @Property({ nullable: true })
  description?: string;

  @OneToMany({
    entity: () => Track,
    mappedBy: (track) => track.playlist,
    orderBy: { position: QueryOrder.ASC },
  })
  tracks = new Collection<Track>(this);
}
