export type ChatMessage = { text: string, sender: ChatSender };

export type Conversation = { id: number, name: string, messages: ChatMessage[] }

export enum ChatSender {
  USER = 'user',
  SYSTEM = 'system'
}
