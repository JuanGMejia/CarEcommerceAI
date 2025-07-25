import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../../shared/services/chat-service';


@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat implements OnInit {

  private chatService = inject(ChatService);
  ngOnInit(): void {
    this.chatService.callApi();
  }


}
