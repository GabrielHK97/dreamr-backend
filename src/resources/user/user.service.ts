import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceData } from 'src/classes/service-data.class';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDetailsDto } from './dto/user-dateils.dto';
import { UserConverter } from './converter/user.converter';
import { SexEnum } from 'src/enum/sex.enum';
import { Request } from 'express';
import { extractTokenFromHeader } from 'src/functions/extract-token-from-header.function';
import { Entry } from '../entry/entities/entry.entity';
import { sleepTime } from 'src/functions/sleep-time.function';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Entry)
    private entryRepository: Repository<Entry>
  ) {}

  async alreadyHasUsername(username: string) {
    return await this.userRepository
      .findOneByOrFail({ username })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  passwordsMatch(password: string, confirmPassword: string) {
    return password === confirmPassword;
  }

  isValidSex(sex: SexEnum) {
    return [SexEnum.MALE, SexEnum.FEMALE, SexEnum.OTHER].includes(sex);
  }

  hasAllFields(createUserDto: CreateUserDto) {
    return (
      createUserDto.name &&
      createUserDto.birthDate &&
      createUserDto.sex &&
      createUserDto.height &&
      createUserDto.username &&
      createUserDto.password &&
      createUserDto.confirmPassword
    );
  }

  async create(createUserDto: CreateUserDto) {
    try {
      if (!this.hasAllFields(createUserDto)) {
        return new ServiceData<void>(HttpStatus.BAD_REQUEST, 'Falta dados!');
      }

      if (await this.alreadyHasUsername(createUserDto.username)) {
        return new ServiceData<void>(
          HttpStatus.BAD_REQUEST,
          'Usuário já existe!',
        );
      }

      if (
        !this.passwordsMatch(
          createUserDto.password,
          createUserDto.confirmPassword,
        )
      ) {
        return new ServiceData<void>(
          HttpStatus.BAD_REQUEST,
          'Senhas não coincidem!',
        );
      }

      if (!this.isValidSex(createUserDto.sex)) {
        return new ServiceData<void>(HttpStatus.BAD_REQUEST, 'Sexo inválido!');
      }

      bcrypt.hash(createUserDto.password, 10, async (err, hash) => {
        createUserDto.password = hash;
        const user = this.userRepository.create(createUserDto);
        await this.userRepository.save(user);
      });

      return new ServiceData<void>(HttpStatus.OK, 'Usuário criado!');
    } catch (error) {
      return new ServiceData<void>(HttpStatus.BAD_REQUEST, error.message);
    }
  }

  async findUser(req: Request) {
    try {
      const token = extractTokenFromHeader(req.headers.cookie);
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = await this.userRepository.findOneBy({ id: payload.id });
      const entries = await this.entryRepository.find({
        where: { userId: payload.id },
      });
      const sleepTimes = entries.map((entry) => {
        return sleepTime(entry);
      });

      const toSeconds = (time: string) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
      };
      const totalSeconds = sleepTimes.reduce(
        (sum, time) => sum + toSeconds(time),
        0,
      );
      const averageSeconds = sleepTimes.length > 0 ?  totalSeconds / sleepTimes.length : totalSeconds;


      const hours = Math.floor(averageSeconds / 3600);
      const minutes = Math.floor((averageSeconds % 3600) / 60);
      const seconds = Math.floor(averageSeconds % 60);

      const sleepTimeAverage = `${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
      }:${seconds < 10 ? `0${seconds}` : seconds}`;
      return new ServiceData<UserDetailsDto>(
        HttpStatus.OK,
        'Dados de usuário achados!',
        UserConverter.userToUserDetailsDto(user, sleepTimeAverage),
      );
    } catch (error) {
      return new ServiceData<void>(
        HttpStatus.BAD_REQUEST,
        'Não pode achar usuário!',
      );
    }
  }
}
