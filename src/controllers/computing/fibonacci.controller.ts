import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { FibonacciService } from '@/services/computing/fibonacci';

@ApiTags('computing')
@Controller('computing')
export class ComputingController {
  constructor(private readonly fibonacciService: FibonacciService) {}

  @Get('fibonacci')
  @ApiQuery({
    name: 'n',
    type: Number,
    description: 'Index in Fibonacci sequence (non-negative integer)',
  })
  @ApiOkResponse({
    description: 'Fibonacci number computed successfully',
    schema: { example: { input: 10, result: 55 } },
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async getFibonacci(@Query('n', ParseIntPipe) n: number) {
    try {
      const result = await this.fibonacciService.getFibonacciNumber(n);
      return { input: n, result };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Invalid input';
      throw new BadRequestException(message);
    }
  }
}

export default ComputingController;
