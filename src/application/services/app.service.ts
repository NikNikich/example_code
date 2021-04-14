import { Injectable } from '@nestjs/common';
import * as os from 'os';
import { uptime } from '../../infrastructure/shared/uptime';
import { humanFileSize } from '../../infrastructure/shared/human.file.size';

@Injectable()
export class AppService {
  getUptime(): {
    uptime: string;
    env: string;
    instance: string;
    image: string;
    system: any;
  } {
    // noinspection JSUnusedGlobalSymbols
    return {
      uptime: uptime(),
      env: process.env.NODE_ENV,
      instance: process.env.INSTANCE,
      image: process.env.REST_IMAGE_NAME,
      system: {
        freemem: humanFileSize(os.freemem(), false),
        totalmem: humanFileSize(os.totalmem(), false),
        loadavg: os.loadavg().map(load => load.toFixed(2)),
        freeRAM: ((os.freemem() / os.totalmem()) * 100).toFixed(2),
        cpus: os.cpus().length,
      },
    };
  }
}
