import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { lookup } from 'geoip-lite';

@Controller()
export class AppController {
  @Get()
  appHandler(@Req() request: Request): Record<string, string | number | any> {
    console.log('Remote address', request.socket.remoteAddress);
    console.log('Local address', request.socket.localAddress);
    const ipAddress = request.ip.toString().replace('::ffff:', '').trim();

    const enhancedData = lookup(ipAddress);

    if (enhancedData) {
      return {
        ipAddress,
        country: enhancedData.country,
        region: enhancedData.region,
        city: enhancedData.city,
        timezone: enhancedData.timezone,
        location: {
          lat: enhancedData.ll[0],
          lng: enhancedData.ll[1],
        },
      };
    }

    return {
      ipAddress,
    };
  }
}
