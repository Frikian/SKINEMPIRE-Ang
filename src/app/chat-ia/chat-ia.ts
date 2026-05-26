import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

type Missatge = {
  autor: 'usuari' | 'bot';
  text: string;
};

@Component({
  selector: 'app-chat-ia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-ia.html',
  styleUrl: './chat-ia.css'
})
export class ChatIa {
  missatge = '';
  carregant = false;

  conversa: Missatge[] = [
    {
      autor: 'bot',
      text: 'Hola, soc el bot de IA. En què et puc ajudar?'
    }
  ];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  enviarMissatge() {
    const text = this.missatge.trim();

    if (!text || this.carregant) {
      return;
    }

    this.conversa.push({
      autor: 'usuari',
      text
    });

    this.missatge = '';
    this.carregant = true;
    this.cdr.detectChanges();

    this.http.post<{ resposta: string }>('http://localhost:4020/api/ia-chat', {
      missatge: text
    }).subscribe({
      next: resposta => {
        this.conversa.push({
          autor: 'bot',
          text: resposta.resposta
        });

        this.carregant = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.conversa.push({
          autor: 'bot',
          text: 'No he pogut respondre ara mateix.'
        });

        this.carregant = false;
        this.cdr.detectChanges();
      }
    });
  }
}
