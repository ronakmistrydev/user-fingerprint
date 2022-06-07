import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { lookup } from 'geoip-lite';
import { getClientIp } from 'request-ip';
import { UAParser } from 'ua-parser-js';

@Controller()
export class AppController {
  @Get()
  appHandler(@Req() request: Request): Record<string, string | number | any> {
    let responsePayload: Record<string, string | number | any> = {};
    const ipAddress = getClientIp(request);
    const enhancedData = lookup(ipAddress);
    const userAgent = request.get('User-Agent') || null;

    if (enhancedData) {
      responsePayload = {
        ...responsePayload,
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

    if (userAgent) {
      const uaParser = new UAParser();
      uaParser.setUA(userAgent);
      const { ua, ...enhancedUserAgent } = uaParser.getResult();

      responsePayload = {
        ...responsePayload,
        ...enhancedUserAgent,
        userAgent,
      };
    }

    return {
      ...responsePayload,
      ipAddress,
    };
  }
}
