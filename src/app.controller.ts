import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class AppController {
  @Get()
  appHandler(@Req() request: Request): string {
    return request.socket.localAddress;
  }
}
