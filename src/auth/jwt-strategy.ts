import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly _configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreException: false,
            secretOrKey: _configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
        });

    }

    validate(payload: any) {
        return { id: payload.id, username: payload.username }
    }
}