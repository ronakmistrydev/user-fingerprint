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
    const enhancedIpAddress = lookup(ipAddress);
    const userAgent = request.get('User-Agent') || null;

    if (enhancedIpAddress) {
      responsePayload = {
        ...responsePayload,
        country: enhancedIpAddress.country,
        region: enhancedIpAddress.region,
        city: enhancedIpAddress.city,
        timezone: enhancedIpAddress.timezone,
        location: {
          lat: enhancedIpAddress.ll[0],
          lng: enhancedIpAddress.ll[1],
        },
      };
    }

    if (userAgent) {
      const uaParser = new UAParser();
      uaParser.setUA(userAgent);
      const enhancedUserAgent = uaParser.getResult();
      responsePayload = {
        ...responsePayload,
        browser: {
          name: enhancedUserAgent.browser.name,
          version: enhancedUserAgent.browser.version,
        },
        engine: {
          name: enhancedUserAgent.engine.name,
          version: enhancedUserAgent.engine.version,
        },
        os: {
          name: enhancedUserAgent.os.name,
          version: enhancedUserAgent.os.name,
        },
        device: {
          type: enhancedUserAgent.device.type,
          model: enhancedUserAgent.device.model,
          vendor: enhancedUserAgent.device.vendor,
        },
        userAgent,
      };
    }

    return {
      ...responsePayload,
      ipAddress,
    };
  }
}
