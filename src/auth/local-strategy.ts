import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "src/user/user.entity";

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly _authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<User> {
        const user = this._authService.validateUser(username, password);
        
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}