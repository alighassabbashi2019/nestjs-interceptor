import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('/signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this._userService.create(createUserDto);
  }
}
