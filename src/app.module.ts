import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComputingController } from './services/computing/fibonacci.controller';

@Module({
  imports: [],
  controllers: [AppController, ComputingController],
  providers: [AppService],
})
export class AppModule {}
