import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';

@Injectable()
export class ProfilesRepository extends Repository<Profile> {
  constructor(private readonly dataSource: DataSource) {
    super(Profile, dataSource.createEntityManager());
  }

  findByUserId(userId: string) {
    return this.findOne({ where: { user_id: userId } });
  }

  findByNickname(nickname: string) {
    return this.findOne({ where: { nickname } });
  }
}
