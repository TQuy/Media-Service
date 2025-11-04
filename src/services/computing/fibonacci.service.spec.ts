import { ClientProxy } from '@nestjs/microservices';
import { FibonacciService } from './fibonacci.service';
import { FIBONACCI_EVENT_NAME } from '@/constants';

describe('FibonacciService', () => {
  let service: FibonacciService;
  let mockQueueClient: Partial<ClientProxy>;

  beforeEach(() => {
    mockQueueClient = {
      emit: jest.fn(),
    };
    service = new FibonacciService(mockQueueClient as ClientProxy);
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

  describe('scheduleFibonacciJob', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should emit fibonacci job to queue with correct payload', () => {
      const number = 10;
      const result = service.scheduleFibonacciJob(number);

      // Verify the method returns the expected message
      expect(result).toEqual({
        message: `Fibonacci job for ${number} has been scheduled.`,
      });

      // Verify that emit was called once
      expect(mockQueueClient.emit as jest.Mock).toHaveBeenCalledTimes(1);

      // Verify the event name and payload structure
      expect(mockQueueClient.emit as jest.Mock).toHaveBeenCalledWith(
        FIBONACCI_EVENT_NAME,
        expect.objectContaining({
          number: number,
          scheduledAt: expect.any(Date) as Date,
        }),
      );
    });

    it('should schedule multiple jobs independently', () => {
      const numbers = [5, 8, 13];

      numbers.forEach((num) => {
        service.scheduleFibonacciJob(num);
      });

      // Verify emit was called for each number
      expect(mockQueueClient.emit as jest.Mock).toHaveBeenCalledTimes(
        numbers.length,
      );

      // Verify each call had the correct payload
      numbers.forEach((num, index) => {
        expect(mockQueueClient.emit as jest.Mock).toHaveBeenNthCalledWith(
          index + 1,
          FIBONACCI_EVENT_NAME,
          expect.objectContaining({
            number: num,
            scheduledAt: expect.any(Date) as Date,
          }),
        );
      });
    });

    it('should handle zero as input', () => {
      const number = 0;
      const result = service.scheduleFibonacciJob(number);

      expect(result.message).toBe(
        `Fibonacci job for ${number} has been scheduled.`,
      );
      expect(mockQueueClient.emit as jest.Mock).toHaveBeenCalledWith(
        FIBONACCI_EVENT_NAME,
        expect.objectContaining({
          number: 0,
          scheduledAt: expect.any(Date) as Date,
        }),
      );
    });

    it('should handle large numbers', () => {
      const number = 1000;
      const result = service.scheduleFibonacciJob(number);

      expect(result.message).toBe(
        `Fibonacci job for ${number} has been scheduled.`,
      );
      expect(mockQueueClient.emit as jest.Mock).toHaveBeenCalledWith(
        FIBONACCI_EVENT_NAME,
        expect.objectContaining({
          number: 1000,
          scheduledAt: expect.any(Date) as Date,
        }),
      );
    });
  });
});
