import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ComputingController } from '@/controllers/computing/fibonacci.controller';
import { FibonacciService } from '@/services/computing/fibonacci.service';

// 1. Import the necessary modules from @nestjs/microservices
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FIBONACCI_QUEUE_NAME, QUEUE_MODULE_NAME } from '@/constants';

@Module({
  imports: [
    // Configure environment variables
    ConfigModule.forRoot({
      envFilePath: 'config/.env',
      isGlobal: true,
    }),

    // Configure RabbitMQ client with environment variables
    ClientsModule.registerAsync([
      {
        name: QUEUE_MODULE_NAME,
        useFactory: (configService: ConfigService) => {
          const username = configService.get<string>(
            'RABBITMQ_USERNAME',
            'myuser',
          );
          const password = configService.get<string>(
            'RABBITMQ_PASSWORD',
            'mypassword',
          );
          const host = configService.get<string>('RABBITMQ_HOST', 'localhost');
          const port = configService.get<number>('RABBITMQ_PORT', 5672);

          const rabbitmqUrl = `amqp://${username}:${password}@${host}:${port}`;

          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitmqUrl],
              queue: FIBONACCI_QUEUE_NAME,
              queueOptions: {
                durable: true,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AppController, ComputingController],
  providers: [AppService, FibonacciService],
})
export class AppModule {}
