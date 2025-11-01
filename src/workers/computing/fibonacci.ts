// src/workers/computing/fibonacci.ts
import { parentPort } from 'worker_threads';
import { WorkerResponse } from '@/types';
import { calculateFibonacciNumber } from '../../utils/fibonacci';

if (!parentPort) {
  throw new Error('This module must be run as a Worker thread');
}

// Listen for messages from the main thread
parentPort.on('message', ({ n }: { n: number }) => {
  try {
    const result = calculateFibonacciNumber(n);
    parentPort!.postMessage({ success: true, result } as WorkerResponse);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    parentPort!.postMessage({
      success: false,
      error: errorMessage,
    } as WorkerResponse);
  }
});
