import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  appIndex() {
    return 'Hello My Nest Backend Server';
  }
}
