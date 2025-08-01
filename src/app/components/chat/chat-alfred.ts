import { Component, ElementRef, inject, OnInit, signal, viewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ChatService } from '../../shared/services/chat-service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChatSender, Conversation } from './chat.model';
import { NgClass } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { finalize, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-chat-alfred',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgClass,
    LoadingComponent
  ],
  templateUrl: './chat-alfred.html',
  styleUrl: './chat-alfred.scss'
})
export class ChatAlfred implements OnInit, OnDestroy {

  chatMessagesScroll = viewChild<ElementRef>('chatMessages');
  userName = signal<string>('');
  isGettingConversations = signal(true);
  private chatService = inject(ChatService);
  private msalService = inject(MsalService);
  private destroy$ = new Subject<void>();
  message = '';
  conversations = signal<Conversation[]>([]);
  selectedConversation = signal<Conversation | null>(null);
  isLoading = signal<boolean>(false);
  cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.getAllConversations();
    this.userName.set(this.msalService.instance.getActiveAccount()?.name?.split(' ')[0] ?? '');
    this.startNewConversation();

    // Suscribirse a la notificación de sesión expirada
    this.chatService.sessionExpired$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.handleSessionExpired();
      });
  }

  getAllConversations() {
    this.chatService.getConversations().subscribe(conversations => {
      this.selectedConversation()?.messages.push(...conversations);
      this.cd.detectChanges();
      this.displayLastMessage();
      this.isGettingConversations.set(false);
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSessionExpired(): void {
    // Agregar mensaje de Alfred sobre la expiración de sesión
    this.selectedConversation.update(conv => {
      conv?.messages.push({
        text: "🔒 Tu sesión ha expirado\nPor políticas de seguridad, las sesiones tienen una duración limitada y esta ha finalizado de forma automática.\nPor favor, vuelve a iniciar sesión para continuar con tu proceso.\nSi necesitas asistencia para ingresar nuevamente, nuestro equipo está disponible para ayudarte",
        sender: ChatSender.SYSTEM
      });
      return { ...conv! };
    });

    this.displayLastMessage();

    // Ejecutar logout después de 3 segundos
    setTimeout(() => {
      this.logout();
    }, 3000);
  }

  logout(): void {
    this.msalService.logoutRedirect({ postLogoutRedirectUri: '/' });
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
        .subscribe({
          next: (response) => {
            this.selectedConversation.update(conv => {
              conv?.messages.push({
                text: response.message,
                sender: ChatSender.SYSTEM
              })
              return { ...conv! }
            });
          },
          error: (error) => {
            // El error 401 ya se maneja en el servicio, aquí solo manejamos otros errores
            if (error.status !== 401) {
              this.selectedConversation.update(conv => {
                conv?.messages.push({
                  text: "Lo siento, ha ocurrido un error. Por favor, intenta nuevamente.",
                  sender: ChatSender.SYSTEM
                })
                return { ...conv! }
              });
            }
          }
        })
      this.message = '';
      this.displayLastMessage();
    }
  }

  displayLastMessage() {
    setTimeout(() => {
      this.chatMessagesScroll()?.nativeElement?.scrollTo(0, this.chatMessagesScroll()?.nativeElement?.scrollHeight)
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

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Detectar si la línea es parte de una lista numerada
      const numberedListMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (numberedListMatch) {
        if (!inList) {
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
            listItems = [];
            inList = false;
            isNumberedList = false;
          }

          // Agregar la línea tal como está (sin procesar)
          processedLines.push(line);
        }
      }
    }

    // Si quedan items de lista al final
    if (inList && listItems.length > 0) {
      processedLines.push(`<div class="list-container">${listItems.join('')}</div>`);
    }

    // Unir las líneas preservando los saltos de línea originales
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
}
