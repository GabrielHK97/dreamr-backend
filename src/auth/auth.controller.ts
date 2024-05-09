import {
    Controller,
    Post,
    Body,
    Req,
    Res,
    Get,
    HttpStatus,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { AuthDto } from './dto/auth.dto';
  import { Request, Response } from 'express';
  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('/login')
    async login(
      @Body() authDto: AuthDto,
      @Res() res: Response,
    ): Promise<Response> {
      const response = await this.authService.login(authDto);
      return response.data
        ? res
            .status(response.status)
            .cookie('token', response.data.token, {httpOnly: true})
            .send(response.getMetadata())
        : res.status(response.status).send(response.getMetadata());
    }
  
    @Get('/logout')
    async logout(
      @Res() res: Response,
    ): Promise<Response> {
      return res.status(HttpStatus.OK).cookie('token', 'logout', {httpOnly: true}).send();
    }
  
    @Get()
    async authenticate(
      @Req() req: Request,
      @Res() res: Response,
    ): Promise<Response> {
      const response = await this.authService.authenticate(req);
      return res.status(response.status).send(response.getMetadata());
    }
  }
  