import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EntryService } from './entry.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('entry')
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createEntryDto: CreateEntryDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.entryService.create(createEntryDto, req);
    return res.status(response.status).send(response.getMetadata());
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    const response = await this.entryService.findAll(req);
    return res.status(response.status).send(response.getMetadata());
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const response = await this.entryService.findOne(req, +id);
    return res.status(response.status).send(response.getMetadata());
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateEntryDto: UpdateEntryDto,
  ) {
    const response = await this.entryService.update(req, +id, updateEntryDto);
    return res.status(response.status).send(response.getMetadata());
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    const response = await this.entryService.remove(+id);
    return res.status(response.status).send(response.getMetadata());
  }
}
