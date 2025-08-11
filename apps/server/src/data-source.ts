import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Match } from './entities/match.entity';
import { Message } from './entities/message.entity';
import { AdImpression } from './entities/ad-impression.entity';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Profile, Match, Message, AdImpression],
  migrations: ['src/migrations/*.ts'],
});

export default dataSource;
