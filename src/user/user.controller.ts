import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dtos/user.dto';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('/signup')
  async signup(@Res() res: Response,@Body() createUserDto: CreateUserDto) {
    const {user, accessToken, refreshToken} = await this._userService.create(createUserDto);
    return res.set({
      'Authorization': accessToken,
      'Refresh_token': refreshToken
    })
    .status(200)
    .send(user)
  }
}
