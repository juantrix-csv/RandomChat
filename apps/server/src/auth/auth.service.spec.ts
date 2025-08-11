import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let users: Partial<Record<keyof Repository<User>, jest.Mock>>;
  let profiles: Partial<Record<keyof Repository<Profile>, jest.Mock>>;
  let jwt: Partial<JwtService>;

  beforeEach(() => {
    users = {
      findOne: jest.fn(),
      create: jest.fn((u) => u),
      save: jest.fn((u) => ({ ...u, id: '1' })),
    };
    profiles = {
      create: jest.fn((p) => p),
      save: jest.fn((p) => p),
    };
    jwt = {
      signAsync: jest.fn().mockResolvedValue('token'),
      decode: jest.fn().mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 1000 }),
      verify: jest.fn().mockReturnValue({ sub: '1', email: 'a@b.com' }),
    };

    service = new AuthService(
      users as unknown as Repository<User>,
      profiles as unknown as Repository<Profile>,
      jwt as unknown as JwtService,
    );
  });

  it('registers a new user', async () => {
    (users.findOne as jest.Mock).mockResolvedValue(null);
    const res = await service.register({ email: 'a@b.com', password: 'password', over18: true });
    expect(res.accessToken).toBeDefined();
    expect(users.save).toHaveBeenCalled();
    expect(profiles.save).toHaveBeenCalled();
  });

  it('fails login with invalid credentials', async () => {
    (users.findOne as jest.Mock).mockResolvedValue(null);
    await expect(service.login({ email: 'a@b.com', password: 'password' })).rejects.toThrow();
  });

  it('logs in with correct credentials', async () => {
    const hash = await bcrypt.hash('password', 10);
    (users.findOne as jest.Mock).mockResolvedValue({ id: '1', email: 'a@b.com', password_hash: hash });
    const res = await service.login({ email: 'a@b.com', password: 'password' });
    expect(res.refreshToken).toBeDefined();
  });
});
