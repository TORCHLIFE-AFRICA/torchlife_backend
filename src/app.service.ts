import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AppService {
    async getHello() {
        return { message: 'Hello world!, Welcome to Torchlife Backend' };
    }

    async getHealth() 
      {
        return { message: 'Healthy', status: 200 };
    }
}
