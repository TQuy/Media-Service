import { FibonacciService } from './fibonacci';

describe('FibonacciService', () => {
  let service: FibonacciService;

  beforeEach(() => {
    service = new FibonacciService();
  });

  it('computes base cases', async () => {
    await expect(service.getFibonacciNumber(0)).resolves.toBe(0);
    await expect(service.getFibonacciNumber(1)).resolves.toBe(1);
  });

  it('computes sequence values', async () => {
    await expect(service.getFibonacciNumber(2)).resolves.toBe(1);
    await expect(service.getFibonacciNumber(3)).resolves.toBe(2);
    await expect(service.getFibonacciNumber(4)).resolves.toBe(3);
    await expect(service.getFibonacciNumber(5)).resolves.toBe(5);
    await expect(service.getFibonacciNumber(6)).resolves.toBe(8);
  });

  it('throws on negative input', async () => {
    await expect(service.getFibonacciNumber(-1)).rejects.toThrow(
      'n needs to be non-negative',
    );
  });

  it('throws on non-integer input', async () => {
    await expect(service.getFibonacciNumber(3.5)).rejects.toThrow(
      'n must be an integer',
    );
  });
});
