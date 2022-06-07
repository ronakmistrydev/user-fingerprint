import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { lookup } from 'geoip-lite';
import requestIp from 'request-ip';

@Controller()
export class AppController {
  @Get()
  appHandler(@Req() request: Request): Record<string, string | number | any> {
    const ipAddress = requestIp.getClientIp(request);
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
