import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';

describe('ComputingController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/computing/fibonacci?n=10 (GET)', async () => {
    // app.getHttpServer() returns any (Nest type), acceptable for supertest; suppress rule locally.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const server = app.getHttpServer();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(server)
      .get('/computing/fibonacci?n=10')
      .expect(200);
    expect(res.body).toEqual({ input: 10, result: 55 });
  });

  it('/computing/fibonacci?n=-1 (GET) - bad request', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const server = app.getHttpServer();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await request(server).get('/computing/fibonacci?n=-1').expect(400);
  });
});
