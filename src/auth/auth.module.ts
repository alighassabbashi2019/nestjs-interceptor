import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthStrategy } from './local-strategy';
import { JwtRefreshAuthStrategy } from './jwt-refresh-strategy';
import { JwtAuthStrategy } from './jwt-strategy';

@Module({
  imports: [UserModule, JwtModule, PassportModule],
  providers: [AuthService, LocalAuthStrategy, JwtRefreshAuthStrategy, JwtAuthStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
