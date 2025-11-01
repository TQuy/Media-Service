import { Injectable } from '@nestjs/common';
import { getFibonacciNumber } from '../../utils/fibonacci';

@Injectable()
export class FibonacciService {
  getFibonacciNumber(n: number): number {
    return getFibonacciNumber(n);
  }
}

export default FibonacciService;
