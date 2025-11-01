import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Worker } from 'worker_threads';
import { WorkerResponse } from '../../types';

@Injectable()
export class FibonacciService {
  getFibonacciNumber(n: number): Promise<number> {
    return new Promise((resolve, reject) => {
      // Determine worker path based on environment
      const isTest =
        process.env.NODE_ENV === 'test' ||
        process.env.JEST_WORKER_ID !== undefined;
      const workerPath = isTest
        ? join(__dirname, '../../workers/computing/fibonacci.ts')
        : join(__dirname, '../../workers/computing/fibonacci.js');

      const worker = new Worker(workerPath, {
        ...(isTest && {
          execArgv: ['--require', 'ts-node/register'],
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
