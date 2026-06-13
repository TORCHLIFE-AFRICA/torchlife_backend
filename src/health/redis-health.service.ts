import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisHealthService implements OnModuleInit, OnModuleDestroy {
    private readonly client: Redis;

    constructor(private readonly configService: ConfigService) {
        this.client = new Redis({
            host: this.configService.get<string>('REDIS_HOST', 'localhost'),
            port: Number(this.configService.get<string>('REDIS_PORT', '6379')),
            password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
            lazyConnect: true,
            maxRetriesPerRequest: 1,
            enableReadyCheck: true,
            connectTimeout: 5000,
        });
    }

    async onModuleInit() {
        await this.ensureConnected();
    }

    async onModuleDestroy() {
        if (this.client.status !== 'end') {
            await this.client.quit();
        }
    }

    async ping() {
        await this.ensureConnected();
        return this.client.ping();
    }

    private async ensureConnected() {
        if (this.client.status === 'ready' || this.client.status === 'connect' || this.client.status === 'connecting') {
            return;
        }

        await this.client.connect();
    }
}
