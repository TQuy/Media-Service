import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '@/app.module';

describe('Swagger Docs (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Setup Swagger in test environment
    const config = new DocumentBuilder()
      .setTitle('Media Service API')
      .setDescription('API for media processing and computing utilities')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/docs (GET) serves swagger ui html', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const server = app.getHttpServer();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(server).get('/docs').expect(200);
    expect(res.text).toContain('Swagger UI');
    expect(res.headers['content-type']).toContain('text/html');
  });

  it('/docs-json (GET) exposes swagger spec', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const server = app.getHttpServer();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(server).get('/docs-json').expect(200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.body.info.title).toBe('Media Service API');
  });
});
