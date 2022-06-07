import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { lookup } from 'geoip-lite';

@Controller()
export class AppController {
  @Get()
  appHandler(@Req() request: Request): Record<string, string | number | any> {
    const ipAddress = request.ip.toString().replace('::ffff:', '').trim();

    const enhancedData = lookup(ipAddress);

    if (enhancedData) {
      return {
        ipAddress,
        ...enhancedData,
      };
    }

    return {
      ipAddress,
    };
  }
}
