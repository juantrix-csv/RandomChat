import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetentionService } from './retention.service';
import { Message } from '../entities/message.entity';
import { Match } from '../entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Match])],
  providers: [RetentionService],
})
export class RetentionModule {}
