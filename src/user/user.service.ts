import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    private readonly _configService: ConfigService
  ) {}

  async create(body: CreateUserDto) {
    const createdUser = this._userRepository.create(body);
    const user = await this._userRepository.save(createdUser);

    const jwtAccessTokenSecret = this._configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
    const jwtRefreshTokenSecret = this._configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
    const jwtAccessTokenExpiresIn = this._configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME');
    const jwtRefreshTokenExpiresIn = this._configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME');

    const tokenPayload = { id: user.id, username: user.username };
    const accessToken = jwt.sign(tokenPayload, jwtAccessTokenSecret, {expiresIn: jwtAccessTokenExpiresIn});
    const refreshToken = jwt.sign(tokenPayload, jwtRefreshTokenSecret, {expiresIn: jwtRefreshTokenExpiresIn});

    user.refresh_token = refreshToken;
    await this._userRepository.save(user);

    return {user, accessToken, refreshToken};
  }

  async findById(id: string) {

    if(!id) {
      throw new BadRequestException('no id provided.')
    }

    const user = await this._userRepository.findOne({where: {id}})

    if(!user) {
      throw new BadRequestException('No user Found by provided id.')
    }

    return user
  }

  async findbyUsername(username: string) {
    const user = await this._userRepository.findOne({ where: { username } })
    return user;
  }

  async findUserByRefreshToken(refreshToken: string) {
    const user = await this._userRepository.findOne({ where: { refresh_token: refreshToken } })
    return user;
  }

  async update(id: string, userPartialInfo: UpdateUserDto) {
    const user = await this._userRepository.findOne({where: {id}});
    Object.assign(user, userPartialInfo)
    const updatedUser = this._userRepository.save(user);
    return updatedUser;
  }
}
