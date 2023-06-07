import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../user/user.service";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly _configService: ConfigService,
        private readonly _userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreException: false,
            secretOrKey: _configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
        });

    }

    async validate(payload: any) {
        const user = await this._userService.findById(payload.id)

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}