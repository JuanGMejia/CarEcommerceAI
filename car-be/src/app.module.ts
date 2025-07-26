import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { JwtStrategy } from './services/jwt.service';
import { PassportModule } from '@nestjs/passport';
import { EmbedService } from './services/embed.service';
import { ChatService } from './services/chat.service';

@Module({
  imports: [PassportModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, EmbedService, ChatService],
})
export class AppModule { }
