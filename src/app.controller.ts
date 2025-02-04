import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private appService: AppService){}
  @Get()
  @Public()
  async getHello() {
    return await this.appService.getHello();
  }
}
