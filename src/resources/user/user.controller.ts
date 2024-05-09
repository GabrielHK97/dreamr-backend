import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const response = await this.userService.create(createUserDto);
    return res.status(response.status).send(response.getMetadata());
  }

  @Get()
  async findUser(@Req() req: Request, @Res() res: Response) {
    const response = await this.userService.findUser(req);
    return res.status(response.status).send(response.getMetadata());

  }
}
