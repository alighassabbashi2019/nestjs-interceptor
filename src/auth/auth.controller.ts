import { Controller, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './lacal-auth.guard';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly _authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async loginUser(@Request() req: any, @Res() res: Response) {
        const { updatedUser, accessToken, refreshToken } = await this._authService.login(req.user);
        return res.set({
            'Authorization': accessToken,
            'Refresh_token': refreshToken 
        })
            .status(200)
            .send(updatedUser)
    }

    @UseGuards(JwtAuthGuard)
    @Post('/logout')
    async logoutUser(@Request() req: any) {
        return await this._authService.logout(req.user);
    }

    @UseGuards(JwtRefreshAuthGuard)
    @Post('/refresh')
    async refreshAccessToken(@Request() req: any, @Res() res: Response) {
        const {user, accessToken} = await this._authService.refreshAccessToken(req.user);
        res.set({
            'Authorization': accessToken
        })
            .status(200)
            .send(user);
    }
}
