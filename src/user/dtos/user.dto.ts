import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from '../user.entity';

export class CreateUserDto extends OmitType(User, ['id', 'refresh_token']) {}

export class UpdateUserDto extends PartialType(OmitType(User, ['id'])) {}
