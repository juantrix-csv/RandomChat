import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from '../entities/profile.entity';
import { ProfilesRepository } from './profiles.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly profiles: ProfilesRepository) {}

  async getMe(userId: string): Promise<Profile> {
    const profile = await this.profiles.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async updateMe(userId: string, dto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.getMe(userId);

    if (dto.nickname) {
      const existing = await this.profiles.findByNickname(dto.nickname);
      if (existing && existing.user_id !== userId) {
        throw new ConflictException('Nickname already taken');
      }
    }

    Object.assign(profile, dto);
    return this.profiles.save(profile);
  }
}
