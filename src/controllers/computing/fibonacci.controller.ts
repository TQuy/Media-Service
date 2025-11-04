import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  BadRequestException,
  Body,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { FibonacciService } from '@/services/computing/fibonacci';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class ScheduleJobDto {
  @ApiProperty({ description: 'Fibonacci number to calculate', minimum: 0 })
  @IsNumber()
  @Min(0)
  number: number;
}

@ApiTags('computing')
@Controller('computing')
export class ComputingController {
  constructor(private readonly fibonacciService: FibonacciService) {}

  /** Schedules a Fibonacci job */
  @Post('fibonacci')
  scheduleJob(@Body() body: ScheduleJobDto) {
    // You would add more robust validation here
    const numberToCalculate = body.number;
    return this.fibonacciService.scheduleFibonacciJob(numberToCalculate);
  }

  /** Calculates the nth Fibonacci number using a Web Worker for non-blocking computation. */
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
