import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { ServiceData } from 'src/classes/service-data.class';
import { User } from 'src/resources/user/entities/user.entity';
import { extractTokenFromHeader } from 'src/functions/extract-token-from-header.function';

interface Token {
    token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private accountRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async login(authDto: AuthDto): Promise<ServiceData<Token>> {
    try {
      const account = await this.accountRepository.findOneByOrFail({
        username: authDto.username,
      });
      if (await bcrypt.compare(authDto.password, account.password)) {
        return new ServiceData<Token>(HttpStatus.OK, 'Logado!', {
          token: this.jwtService.sign({
            id: account.id,
            username: account.username,
          }),
        });
      }
      return new ServiceData<Token>(HttpStatus.BAD_REQUEST, 'Login sem sucesso!');
    } catch (error) {
      return new ServiceData<Token>(HttpStatus.BAD_REQUEST, 'Login sem sucesso!');
    }
  }

  async authenticate(req: Request): Promise<ServiceData> {
    const token = extractTokenFromHeader(req.headers.cookie);
    return await this.jwtService
      .verifyAsync(token)
      .then(() => {
        return new ServiceData(HttpStatus.OK, 'Validado!');
      })
      .catch(() => {
        return new ServiceData(HttpStatus.UNAUTHORIZED, 'Não pôde validar!');
      });
  }
}
