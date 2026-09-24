import { Injectable, UnauthorizedException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../database/db';
import { admins } from '../../database/schema';
import { PasswordUtil } from '../../common/utils/password.util';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto) {
    const user = await db.query.admins.findFirst({
      where: eq(admins.email, loginDto.email),
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await PasswordUtil.verify(user.passwordHash, loginDto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await db
      .update(admins)
      .set({ lastLoginAt: new Date() })
      .where(eq(admins.id, user.id));

    return {
      id: user.id,
      email: user.email,
      status: user.status,
    };
  }

  async getMe(userId: string) {
    const user = await db.query.admins.findFirst({
      where: eq(admins.id, userId),
    });

    if (!user || user.status !== 'ACTIVE') {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
    };
  }
}
