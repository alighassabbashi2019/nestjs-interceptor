import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  create(user: CreateUserDto) {
    console.log(user);
  }
}
