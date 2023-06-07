import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtRefreshAuthStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {

    constructor(
        private readonly _userService: UserService,
        private readonly _configService: ConfigService,
    ) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                    return req.headers.refresh_token.toString()
                }]),
                secretOrKey: _configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
                passReqToCallback: true
            }
        )
    }

    async validate(request: Request) {
        const refreshToken = request.headers.refresh_token.toString()
        const user = await this._userService.findUserByRefreshToken(refreshToken);
        
        console.log(user);
        if (!user) {
            throw new UnauthorizedException();
        }
        
        return user;
    }
}