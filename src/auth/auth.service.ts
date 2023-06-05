import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(private readonly _userService: UserService, private readonly _jwtService: JwtService, private readonly _configService: ConfigService) {}

    async validateUser(username: string, password: string) {
        const user = await this._userService.findbyUsername(username);

        if (user && user.password === password) {
            return user;
        }
        return null;
    }
    
    async login(user: User) {
        const jwtPayload = { id: user.id, username: user.username }

        const jwtAccessTokenSecret = this._configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
        const jwtAccessTokenExpiresIn = this._configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')

        const jwtRefreshTokenSecret = this._configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
        const jwtRefteshTokenExpiresIn = this._configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')

        const accessToken = this._jwtService.sign(jwtPayload, {secret: jwtAccessTokenSecret, expiresIn: jwtAccessTokenExpiresIn})
        const refreshToken = this._jwtService.sign(jwtPayload, { secret: jwtRefreshTokenSecret, expiresIn: jwtRefteshTokenExpiresIn })

        const updatedUser = await this._userService.update(user.id, {refresh_token: refreshToken})
        
        return {updatedUser, accessToken, refreshToken}
    }

    async refreshAccessToken(user: User) {
        const jwtPayload = { id: user.id, username: user.username }

        const jwtAccessTokenSecret = this._configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
        const jwtAccessTokenExpiresIn = this._configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')

        const accessToken = this._jwtService.sign(jwtPayload, { secret: jwtAccessTokenSecret, expiresIn: jwtAccessTokenExpiresIn })
        
        return {user, accessToken}
    }

    async logout(user: User) {
        return await this._userService.update(user.id, {refresh_token: null})
    }
}
