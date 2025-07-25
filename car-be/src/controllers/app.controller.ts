import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { AzureADGuard } from 'src/services/jwt.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('chat')
  @UseGuards(AzureADGuard)
  protected(@Body() info: { message: string }): { message: string } {
    console.log('Protected route accessed with message:', info.message);
    return { message: 'Hello From Chat Api' };
  }
}
