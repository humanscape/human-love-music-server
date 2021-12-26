import { Repository } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Radio } from './radio.entity';

@Repository(Radio)
export class RadioRepository extends EntityRepository<Radio> {}
