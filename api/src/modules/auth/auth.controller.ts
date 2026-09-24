import { Controller, Post, Get, Body, Session, HttpCode, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Session() session: Record<string, any>) {
    const user = await this.authService.login(loginDto);
    session.userId = user.id;
    return user;
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async logout(@Session() session: Record<string, any>) {
    return new Promise((resolve, reject) => {
      session.destroy((err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Logged out successfully' });
        }
      });
    });
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@CurrentUser() userId: string, @Session() session: Record<string, any>) {
    const user = await this.authService.getMe(session.userId);
    
    if (!user) {
      throw new UnauthorizedException('Session invalid');
    }

    return user;
  }
}
