import { ConflictException, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface StoredToken {
  userId: string;
  expires: Date;
}

interface JwtPayload {
  sub: string;
  email: string;
  exp: number;
}

@Injectable()
export class AuthService {
  // In-memory store for refresh tokens with TTL
  private refreshTokens = new Map<string, StoredToken>();

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Profile) private readonly profiles: Repository<Profile>,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<TokenPair> {
    const existing = await this.users.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    if (!dto.over18) {
      throw new BadRequestException('Must confirm age 18+');
    }

    const password_hash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.save(this.users.create({ email: dto.email, password_hash }));
    await this.profiles.save(
      this.profiles.create({
        user_id: user.id,
        nickname: dto.nickname ?? dto.email,
        is_over_18: dto.over18,
      }),
    );

    const tokens = await this.generateTokens(user.id, user.email);
    this.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async login(dto: LoginDto): Promise<TokenPair> {
    const user = await this.users.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.generateTokens(user.id, user.email);
    this.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refresh(dto: RefreshDto): Promise<TokenPair> {
    const payload = this.verifyRefreshToken(dto.refreshToken);
    // rotate refresh token
    this.refreshTokens.delete(dto.refreshToken);
    const tokens = await this.generateTokens(payload.sub, payload.email);
    this.storeRefreshToken(payload.sub, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string, dto: RefreshDto): Promise<void> {
    const stored = this.refreshTokens.get(dto.refreshToken);
    if (stored && stored.userId === userId) {
      this.refreshTokens.delete(dto.refreshToken);
    }
  }

  private async generateTokens(userId: string, email: string): Promise<TokenPair> {
    const payload = { sub: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, { expiresIn: '15m' }),
      this.jwt.signAsync(payload, { expiresIn: '7d' }),
    ]);
    return { accessToken, refreshToken };
  }

  private storeRefreshToken(userId: string, token: string): void {
    const decoded = this.jwt.decode(token) as JwtPayload;
    const expires = new Date(decoded.exp * 1000);
    this.refreshTokens.set(token, { userId, expires });
  }

  private verifyRefreshToken(token: string): { sub: string; email: string } {
    const stored = this.refreshTokens.get(token);
    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (stored.expires.getTime() < Date.now()) {
      this.refreshTokens.delete(token);
      throw new UnauthorizedException('Refresh token expired');
    }
    try {
      return this.jwt.verify<{ sub: string; email: string }>(token);
    } catch {
      this.refreshTokens.delete(token);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
