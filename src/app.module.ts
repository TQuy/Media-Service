import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComputingController } from './controllers/computing/fibonacci.controller';

@Module({
  imports: [],
  controllers: [AppController, ComputingController],
  providers: [AppService],
})
export class AppModule {}
