import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { lookup } from 'geoip-lite';

@Controller()
export class AppController {
  @Get()
  appHandler(@Req() request: Request): Record<string, string | number | any> {
    const initialIpAddress = request.header('x-forwarded-for') || request.socket.remoteAddress);
    const ipAddress = initialIpAddress.toString().replace('::ffff:', '').trim();

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
