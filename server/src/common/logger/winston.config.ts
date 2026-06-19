import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('ViệtFlow', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
    // Optional: Add File transport for production logs
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
};
