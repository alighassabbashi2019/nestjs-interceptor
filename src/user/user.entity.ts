import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';

@Entity()
export class User {

  @ApiProperty()
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @IsString()
  @Column()
  name: string;
  
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Column()
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Column()
  password: string;

  @IsString()
  @Column({nullable: true})
  refresh_token: string;
}
