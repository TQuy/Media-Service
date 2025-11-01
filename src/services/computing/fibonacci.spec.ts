import { FibonacciService } from './fibonacci';

describe('FibonacciService', () => {
  let service: FibonacciService;

  beforeEach(() => {
    service = new FibonacciService();
  });

  it('computes base cases', () => {
    expect(service.getFibonacciNumber(0)).toBe(0);
    expect(service.getFibonacciNumber(1)).toBe(1);
  });

  it('computes sequence values', () => {
    expect(service.getFibonacciNumber(2)).toBe(1);
    expect(service.getFibonacciNumber(3)).toBe(2);
    expect(service.getFibonacciNumber(4)).toBe(3);
    expect(service.getFibonacciNumber(5)).toBe(5);
    expect(service.getFibonacciNumber(6)).toBe(8);
  });

  it('throws on negative input', () => {
    expect(() => service.getFibonacciNumber(-1)).toThrow(
      'n needs to be non-negative',
    );
  });

  it('throws on non-integer input', () => {
    const invokeWithUnknown = (value: unknown) =>
      service.getFibonacciNumber(value as number);
    expect(() => invokeWithUnknown(3.5)).toThrow('n must be an integer');
  });
});
