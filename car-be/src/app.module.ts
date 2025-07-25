import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { JwtStrategy } from './services/jwt.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule { }
