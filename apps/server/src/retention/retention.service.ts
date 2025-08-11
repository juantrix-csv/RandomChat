import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { Match } from '../entities/match.entity';

@Injectable()
export class RetentionService {
  constructor(
    @InjectRepository(Message) private readonly messages: Repository<Message>,
    @InjectRepository(Match) private readonly matches: Repository<Match>,
  ) {}

  // Intended to be triggered by a scheduler/cron job
  async purgeInactive(): Promise<void> {
    await this.messages
      .createQueryBuilder()
      .delete()
      .where("created_at < now() - interval '30 days'")
      .execute();

    await this.matches
      .createQueryBuilder()
      .delete()
      .where("(closed_at IS NOT NULL AND closed_at < now() - interval '30 days') OR " +
             "(closed_at IS NULL AND created_at < now() - interval '30 days')")
      .execute();
  }
}
