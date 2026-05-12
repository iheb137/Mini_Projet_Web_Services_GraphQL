import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    
    const payload = { sub: user.id, role: user.role };
    return {
      user: this.excludePassword(user),
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, role: user.role };
    return {
      user: this.excludePassword(user),
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(payload: any) {
    const user = await this.usersService.findOne(payload.sub);
    return this.excludePassword(user);
  }

  private excludePassword(user: any) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
