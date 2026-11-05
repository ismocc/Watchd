import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // if INVITE_CODE is set only people who know it can sign up (so randoms cant make accounts)
    const invite = process.env.INVITE_CODE;
    if (invite && dto.inviteCode?.trim() !== invite) {
      throw new ForbiddenException('wrong invite code');
    }

    const email = dto.email.toLowerCase();
    const taken = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username: dto.username }] },
    });
    if (taken) {
      throw new ConflictException(taken.email === email ? 'email already in use' : 'username already taken');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email, username: dto.username, passwordHash },
    });
    return this.withToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('wrong email or password');
    }
    return this.withToken(user);
  }

  async me(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException();
    }
    return this.publicUser(user);
  }

  private async withToken(user: { id: number; email: string; username: string; createdAt: Date }) {
    const token = await this.jwt.signAsync({ sub: user.id, username: user.username });
    return { token, user: this.publicUser(user) };
  }

  private publicUser(user: { id: number; email: string; username: string; createdAt: Date }) {
    return { id: user.id, email: user.email, username: user.username, createdAt: user.createdAt };
  }
}
