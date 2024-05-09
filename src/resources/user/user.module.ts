import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Entry } from '../entry/entities/entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Entry])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
