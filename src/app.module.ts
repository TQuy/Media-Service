import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComputingController } from './controllers/computing/fibonacci.controller';
import { FibonacciService } from './services/computing/fibonacci';

@Module({
  imports: [],
  controllers: [AppController, ComputingController],
  providers: [AppService, FibonacciService],
})
export class AppModule {}
