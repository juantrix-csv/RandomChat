import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Match } from './entities/match.entity';
import { Message } from './entities/message.entity';
import { AdImpression } from './entities/ad-impression.entity';
import { RetentionModule } from './retention/retention.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Profile, Match, Message, AdImpression],
      synchronize: false,
    }),
    HealthModule,
    RetentionModule,
    AuthModule,
  ],
})
export class AppModule {}
