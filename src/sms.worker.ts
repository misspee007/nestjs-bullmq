import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('sms', { limiter: { max: 10, duration: 1000 } }) // instead of concurrency
export class SmsWorker extends WorkerHost {
  async process(job: Job) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
  }

  @OnWorkerEvent('active')
  onAdded(job: Job) {
    console.log('Processing job, ', job.id);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log('Job completed, ', job.id);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.log('Job failed, ', job.id);
  }
}
