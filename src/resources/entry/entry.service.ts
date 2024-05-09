import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ServiceData } from 'src/classes/service-data.class';
import { extractTokenFromHeader } from 'src/functions/extract-token-from-header.function';
import { sleepTime } from 'src/functions/sleep-time.function';
import { Not, Repository } from 'typeorm';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { Entry } from './entities/entry.entity';

@Injectable()
export class EntryService {
  constructor(
    @InjectRepository(Entry)
    private entryRepository: Repository<Entry>,
  ) {}

  async alreadyHasDate(dateStart: string) {
    return await this.entryRepository
      .findOneByOrFail({ dateStart })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  async alreadyHasDateUpdate(dateStart: string, id: number) {
    return await this.entryRepository
      .findOneByOrFail({ dateStart, id: Not(id) })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  hasAllFields(createEntryDto: CreateEntryDto | UpdateEntryDto) {
    return (
      createEntryDto.dateStart &&
      createEntryDto.dateEnd &&
      createEntryDto.timeStart &&
      createEntryDto.timeEnd
    );
  }

  async create(
    createEntryDto: CreateEntryDto,
    req: Request,
  ): Promise<ServiceData<void>> {
    try {
      if (!this.hasAllFields(createEntryDto)) {
        return new ServiceData<void>(HttpStatus.BAD_REQUEST, 'Falta dados!');
      }

      if (await this.alreadyHasDate(createEntryDto.dateStart)) {
        return new ServiceData<void>(
          HttpStatus.BAD_REQUEST,
          'Data Início já existe!',
        );
      }

      const token = extractTokenFromHeader(req.headers.cookie);
      const payload = JSON.parse(atob(token.split('.')[1]));

      const entry = this.entryRepository.create(createEntryDto);
      entry.userId = payload.id;
      await this.entryRepository.save(entry);

      return new ServiceData<void>(HttpStatus.OK, 'Registro criado!');
    } catch (error) {
      return new ServiceData<void>(HttpStatus.BAD_REQUEST, error.message);
    }
  }

  async findAll(req: Request) {
    try {
      const token = extractTokenFromHeader(req.headers.cookie);
      const payload = JSON.parse(atob(token.split('.')[1]));

      const entries = await this.entryRepository.find({
        order: { dateStart: 'DESC' },
        where: { userId: payload.id },
      });
      const formattedEntries = entries.map((entry) => {
        return {
          ...entry,
          sleepTime: sleepTime(entry),
        };
      });
      return new ServiceData<Entry[]>(
        HttpStatus.OK,
        'Entries found!',
        formattedEntries,
      );
    } catch (error) {
      return new ServiceData<void>(HttpStatus.BAD_REQUEST, error.message);
    }
  }

  async findOne(req: Request, id: number) {
    try {
      const token = extractTokenFromHeader(req.headers.cookie);
      const payload = JSON.parse(atob(token.split('.')[1]));

      const entry = await this.entryRepository.findOneBy({
        userId: payload.id,
        id,
      });
      return new ServiceData<Entry>(HttpStatus.OK, 'Registro achado!', entry);
    } catch (error) {
      return new ServiceData<void>(HttpStatus.BAD_REQUEST, error.message);
    }
  }

  async update(req: Request, id: number, updateEntryDto: UpdateEntryDto) {
    try {
      const token = extractTokenFromHeader(req.headers.cookie);
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (!this.hasAllFields(updateEntryDto)) {
        return new ServiceData<void>(HttpStatus.BAD_REQUEST, 'Falta dados!');
      }

      if (
        await this.alreadyHasDateUpdate(updateEntryDto.dateStart, id)
      ) {
        return new ServiceData<void>(
          HttpStatus.BAD_REQUEST,
          'Data de início já existe!',
        );
      }
      const entry = this.entryRepository.create(updateEntryDto);
      await this.entryRepository.update(id, entry);

      return new ServiceData<void>(HttpStatus.OK, 'Registro atualizado!');
    } catch (error) {
      return new ServiceData<void>(HttpStatus.BAD_REQUEST, error.message);
    }
  }

  async remove(id: number) {
    try {
      const entry = await this.entryRepository.delete(id);
      return new ServiceData<void>(HttpStatus.OK, 'Registro deletado!');
    } catch (error) {
      return new ServiceData<void>(HttpStatus.BAD_REQUEST, error.message);
    }
  }
}
