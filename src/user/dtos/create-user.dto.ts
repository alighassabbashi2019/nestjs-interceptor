import { OmitType } from '@nestjs/swagger';
import { User } from '../user.entity';

export class CreateUserDto extends OmitType(User, ['id']) {}
