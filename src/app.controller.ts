import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import geoIp from 'geoip-lite';

@Controller()
export class AppController {
  @Get()
  appHandler(@Req() request: Request): Record<string, string | number | any> {
    const ipAddress = request.ip.toString().replace('::ffff:', '').trim();

    const lookup = geoIp.lookup(ipAddress);

    if (lookup) {
      return {
        ipAddress,
        ...lookup,
      };
    }

    return {
      ipAddress,
    };
  }
}
