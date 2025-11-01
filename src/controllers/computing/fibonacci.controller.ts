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
import { getFibonacciNumber } from '../../utils/fibonacci';

@ApiTags('computing')
@Controller('computing')
export class ComputingController {
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
  getFibonacci(@Query('n', ParseIntPipe) n: number) {
    try {
      const result = getFibonacciNumber(n);
      return { input: n, result };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Invalid input';
      throw new BadRequestException(message);
    }
  }
}

export default ComputingController;
