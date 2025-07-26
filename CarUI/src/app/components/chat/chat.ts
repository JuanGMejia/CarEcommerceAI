import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { ChatService } from '../../shared/services/chat-service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChatSender, Conversation } from './chat.model';
import { NgClass } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgClass,
    MatTooltipModule
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat implements OnInit {

  chatMessagesScroll = viewChild<ElementRef>('chatMessages');
  userName = signal<string>('');
  private chatService = inject(ChatService);
  private msalService = inject(MsalService);
  message = '';
  conversations = signal<Conversation[]>([]);
  selectedConversation = signal<Conversation | null>(null);

  ngOnInit(): void {
    this.userName.set(this.msalService.instance.getActiveAccount()?.name ?? '');
    this.startNewConversation();
  }

  sendMessage() {
    if (this.message.trim()) {
      this.selectedConversation()?.messages.push({
        text: this.message.trim(),
        sender: ChatSender.USER
      });
      this.chatService.callApi(this.message.trim()).subscribe(response => {
        this.selectedConversation.update(conv => {
          conv?.messages.push({
            text: response.message,
            sender: ChatSender.SYSTEM
          })
          return { ...conv! }
        });
      })
      this.message = '';
      this.displayLastMessage();
    }
  }

  displayLastMessage() {
    setTimeout(() => {
      this.chatMessagesScroll()!.nativeElement.scrollTo(0, this.chatMessagesScroll()!.nativeElement.scrollHeight)
    }, 100)
  }

  selectConversation(conv: any) {
    this.selectedConversation.set(conv);
  }

  startNewConversation() {
    const newConv = {
      id: Date.now(),
      name: `Conversation ${this.conversations().length + 1}`,
      messages: [],
    };
    this.conversations().unshift(newConv);
    this.selectConversation(newConv);
  }
}
