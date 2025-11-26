import { Module } from '@nestjs/common';
import { SmsController } from './sms.controller';
import { BullModule } from '@nestjs/bullmq';
import { SmsWorker } from './sms.worker';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? '127.0.0.1',
        port: Number(process.env.REDIS_PORT ?? 6379),
      },
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 100,
        removeOnFail: 1000,
        backoff: 2000, // 2 seconds
      },
    }),
    BullModule.registerQueue({ name: 'sms' }),
  ],
  controllers: [SmsController],
  providers: [SmsWorker],
})
export class AppModule {}
