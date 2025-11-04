import { Worker } from 'worker_threads';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { WorkerResponse } from '@/types';
import { FIBONACCI_EVENT_NAME, QUEUE_MODULE_NAME } from '@/constants';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FibonacciService {
  private logger: Logger;
  constructor(
    @Inject(QUEUE_MODULE_NAME) private readonly queueClient: ClientProxy,
  ) {
    this.logger = new Logger(FibonacciService.name);
  }

  /**
   * This method now *schedules* a fibonacci job by sending
   * it to the queue instead of calculating it directly.
   */
  scheduleFibonacciJob(number: number) {
    const payload = { number: number, scheduledAt: new Date() };

    this.logger.log(
      `Sending job to 'fibonacci_jobs_queue' with payload: ${JSON.stringify(payload)}`,
    );

    // 'emit' sends an event (fire-and-forget, no response expected)
    // Use 'send' if you need to wait for a response from the worker.
    this.queueClient.emit(FIBONACCI_EVENT_NAME, payload);
    // The first argument 'fibonacci_job_event' is the *event pattern*
    // or *message name* that a worker will listen for.

    return { message: `Fibonacci job for ${number} has been scheduled.` };
  }

  /** Calculates the nth Fibonacci number using a Web Worker for non-blocking computation. */
  getFibonacciNumber(n: number): Promise<number> {
    return new Promise((resolve, reject) => {
      // Determine worker path based on environment
      const configService = new ConfigService();
      const isTest =
        configService.get<string>('NODE_ENV') === 'test' ||
        configService.get<string>('JEST_WORKER_ID') !== undefined;
      const isDev = configService.get<string>('NODE_ENV') === 'development';
      const workerPath =
        isTest || isDev
          ? './src/workers/computing/fibonacci.workerThread.ts'
          : './workers/computing/fibonacci.workerThread.js';

      const worker = new Worker(workerPath, {
        ...((isTest || isDev) && {
          execArgv: [
            '--require',
            'ts-node/register',
            '--require',
            'tsconfig-paths/register',
          ],
        }),
      });

      worker.postMessage({ n });

      worker.on('message', (response: WorkerResponse) => {
        if (response.success && response.result !== undefined) {
          resolve(response.result);
        } else {
          reject(new Error(response.error || 'Worker computation failed'));
        }
        void worker.terminate();
      });

      worker.on('error', (err) => {
        reject(err);
        void worker.terminate();
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }
}

export default FibonacciService;
