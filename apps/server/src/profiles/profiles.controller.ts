import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

interface JwtRequest extends Request {
  user: { sub: string; email: string };
}

@ApiTags('profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profiles: ProfilesService) {}

  @Get('me')
  getMe(@Req() req: JwtRequest) {
    return this.profiles.getMe(req.user.sub);
  }

  @Patch('me')
  updateMe(@Req() req: JwtRequest, @Body() dto: UpdateProfileDto) {
    return this.profiles.updateMe(req.user.sub, dto);
  }
}
