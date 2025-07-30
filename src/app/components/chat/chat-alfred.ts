import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { ChatService } from '../../shared/services/chat-service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChatSender, Conversation } from './chat.model';
import { NgClass } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-chat-alfred',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgClass
  ],
  templateUrl: './chat-alfred.html',
  styleUrl: './chat-alfred.scss'
})
export class ChatAlfred implements OnInit {

  chatMessagesScroll = viewChild<ElementRef>('chatMessages');
  userName = signal<string>('');
  private chatService = inject(ChatService);
  private msalService = inject(MsalService);
  message = '';
  conversations = signal<Conversation[]>([]);
  selectedConversation = signal<Conversation | null>(null);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.userName.set(this.msalService.instance.getActiveAccount()?.name ?? '');
    this.startNewConversation();
  }

  sendMessage() {
    this.isLoading.set(true);
    if (this.message.trim()) {
      this.selectedConversation()?.messages.push({
        text: this.message.trim(),
        sender: ChatSender.USER
      });
      this.chatService.callApi(this.message.trim())
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe(response => {
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

  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  // Función para procesar el formato del texto (listas y negrilla)
  processMessageFormat(text: string): string {
    // Primero procesar negrilla
    let processedText = this.processBoldFormat(text);
    
    // Luego procesar listas numeradas
    processedText = this.processNumberedLists(processedText);
    
    // Finalmente agregar emojis
    return this.addEmojiToMessage(processedText);
  }

  // Procesar formato de negrilla con **
  processBoldFormat(text: string): string {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  // Procesar listas numeradas
  processNumberedLists(text: string): string {
    const lines = text.split('\n');
    const processedLines: string[] = [];
    let inList = false;
    let listItems: string[] = [];
    let isNumberedList = false;
    let hasContentBeforeList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detectar si la línea es parte de una lista numerada
      const numberedListMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (numberedListMatch) {
        if (!inList) {
          // Solo agregar línea en blanco si hay contenido antes de la lista
          if (hasContentBeforeList) {
            processedLines.push('<br>');
          }
          inList = true;
          isNumberedList = true;
        }
        const number = numberedListMatch[1];
        const content = numberedListMatch[2];
        listItems.push(`<div class="numbered-list-item"><span class="list-number">${number}.</span> <span class="list-content">${content}</span></div>`);
      } else {
        // Detectar si la línea es parte de una lista con guiones (con sangría)
        const bulletListMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
        if (bulletListMatch) {
          if (!inList) {
            // Solo agregar línea en blanco si hay contenido antes de la lista
            if (hasContentBeforeList) {
              processedLines.push('<br>');
            }
            inList = true;
            isNumberedList = false;
          }
          const indentation = bulletListMatch[1];
          const content = bulletListMatch[2];
          const indentLevel = Math.floor(indentation.length / 2); // Cada 2 espacios = 1 nivel
          
          listItems.push(`<div class="bullet-list-item" style="margin-left: ${indentLevel * 20}px;"><span class="bullet">•</span> <span class="list-content">${content}</span></div>`);
        } else {
          // No es parte de una lista
          if (inList && listItems.length > 0) {
            // Final de lista - agregar todos los items
            processedLines.push(`<div class="list-container">${listItems.join('')}</div>`);
            
            // Solo agregar línea en blanco después si es una lista numerada
            if (isNumberedList) {
              processedLines.push('<br>');
            }
            
            listItems = [];
            inList = false;
            isNumberedList = false;
          }
          
          // Si la línea no está vacía, marcar que hay contenido
          if (line.trim() !== '') {
            hasContentBeforeList = true;
          }
          
          processedLines.push(line);
        }
      }
    }
    
    // Si quedan items de lista al final
    if (inList && listItems.length > 0) {
      processedLines.push(`<div class="list-container">${listItems.join('')}</div>`);
      
      // Solo agregar línea en blanco después si es una lista numerada
      if (isNumberedList) {
        processedLines.push('<br>');
      }
    }
    
    return processedLines.join('\n');
  }

  // Función para agregar emojis automáticamente basado en el contenido
  addEmojiToMessage(text: string): string {
    const lowerText = text.toLowerCase();
    
    // Emojis para diferentes tipos de contenido
    if (lowerText.includes('hola') || lowerText.includes('buenos días') || lowerText.includes('buenas')) {
      return text + ' 👋';
    }
    if (lowerText.includes('gracias') || lowerText.includes('thanks')) {
      return text + ' 🙏';
    }
    if (lowerText.includes('carro') || lowerText.includes('auto') || lowerText.includes('vehículo')) {
      return text + ' 🚗';
    }
    if (lowerText.includes('precio') || lowerText.includes('costo') || lowerText.includes('dinero')) {
      return text + ' 💰';
    }
    if (lowerText.includes('oferta') || lowerText.includes('descuento') || lowerText.includes('promoción')) {
      return text + ' 🎉';
    }
    if (lowerText.includes('prueba') || lowerText.includes('test drive')) {
      return text + ' 🚀';
    }
    if (lowerText.includes('ayuda') || lowerText.includes('soporte')) {
      return text + ' 🆘';
    }
    if (lowerText.includes('excelente') || lowerText.includes('perfecto') || lowerText.includes('genial')) {
      return text + ' 👍';
    }
    if (lowerText.includes('problema') || lowerText.includes('error')) {
      return text + ' ⚠️';
    }
    if (lowerText.includes('información') || lowerText.includes('detalles')) {
      return text + ' ℹ️';
    }
    
    return text;
  }

  // Método de prueba para verificar el formato de listas
  testListFormatting(): void {
    const testText = `1. **Nissan X-Trail 2022**
   - Precio: $30,000 USD
   - Tipo: SUV compacto
   - Características:
     - Motor: 2.5L 4 cilindros
     - Potencia: 170 hp
     - Eficiencia de combustible: 26 mpg en ciudad, 33 mpg en carretera
     - Seguridad: Nissan Safety Shield 360, control de tracción
     - Tecnología: Pantalla táctil de 8 pulgadas, cámara de 360 grados, Apple CarPlay

Si necesitas más información sobre algún vehículo en específico, ¡no dudes en preguntar! 🚗`;
    
    console.log('Texto procesado:', this.processMessageFormat(testText));
  }
} 