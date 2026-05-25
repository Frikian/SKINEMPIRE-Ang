import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type CaptchaType = 'math' | 'text' | 'sequence' | 'color' | 'word';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './captcha.html',
  styleUrl: './captcha.css',
})
export class CaptchaComponent implements OnInit {
  @Output() captchaValidated = new EventEmitter<boolean>();

  captchaType: CaptchaType = 'math';
  isValid = false;
  showError = false;
  userInput = '';

  num1 = 0;
  num2 = 0;
  mathOperator: '+' | '-' | 'x' = '+';
  mathAnswer = 0;

  captchaText = '';
  captchaChars: { char: string; rotate: number; color: string; size: number }[] = [];

  sequence: number[] = [];
  sequenceAnswer = 0;

  colorOptions: { name: string; hex: string }[] = [];
  targetColor = '';
  targetColorHex = '';
  selectedColor = '';

  wordGroups: { word: string; category: string }[] = [];
  oddWord = '';
  wordOptions: string[] = [];
  selectedWord = '';

  private allColors = [
    { name: 'Vermell', hex: '#e74c3c' },
    { name: 'Blau', hex: '#3498db' },
    { name: 'Verd', hex: '#2ecc71' },
    { name: 'Groc', hex: '#f1c40f' },
    { name: 'Taronja', hex: '#e67e22' },
    { name: 'Morat', hex: '#9b59b6' },
    { name: 'Rosa', hex: '#e91e8c' },
    { name: 'Cian', hex: '#1abc9c' },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.generateCaptcha();
  }

  generateCaptcha(): void {
    this.userInput = '';
    this.selectedColor = '';
    this.selectedWord = '';
    this.isValid = false;
    this.showError = false;

    const types: CaptchaType[] = ['math', 'text', 'sequence', 'color', 'word'];
    this.captchaType = types[Math.floor(Math.random() * types.length)];

    switch (this.captchaType) {
      case 'math':
        this.generateMathCaptcha();
        break;
      case 'text':
        this.generateTextCaptcha();
        break;
      case 'sequence':
        this.generateSequenceCaptcha();
        break;
      case 'color':
        this.generateColorCaptcha();
        break;
      case 'word':
        this.generateWordCaptcha();
        break;
    }
    this.cdr.detectChanges();
  }

  private generateMathCaptcha(): void {
    const operators: ('+' | '-' | 'x')[] = ['+', '-', 'x'];
    this.mathOperator = operators[Math.floor(Math.random() * operators.length)];
    if (this.mathOperator === '+') {
      this.num1 = Math.floor(Math.random() * 20) + 1;
      this.num2 = Math.floor(Math.random() * 20) + 1;
      this.mathAnswer = this.num1 + this.num2;
    } else if (this.mathOperator === '-') {
      this.num1 = Math.floor(Math.random() * 20) + 10;
      this.num2 = Math.floor(Math.random() * this.num1) + 1;
      this.mathAnswer = this.num1 - this.num2;
    } else {
      this.num1 = Math.floor(Math.random() * 9) + 2;
      this.num2 = Math.floor(Math.random() * 9) + 2;
      this.mathAnswer = this.num1 * this.num2;
    }
  }

  private generateTextCaptcha(): void {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    this.captchaText = '';
    for (let i = 0; i < 6; i++) {
      this.captchaText += chars[Math.floor(Math.random() * chars.length)];
    }
    const colors = ['#fdebb7', '#b59356', '#e07070', '#7ddb7d', '#7db8db', '#db7ddb'];
    this.captchaChars = this.captchaText.split('').map((char) => ({
      char,
      rotate: Math.floor(Math.random() * 40) - 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.floor(Math.random() * 8) + 18,
    }));
  }

  private generateSequenceCaptcha(): void {
    const start = Math.floor(Math.random() * 10) + 1;
    const step = Math.floor(Math.random() * 5) + 2;
    const length = 4;
    this.sequence = [];
    for (let i = 0; i < length; i++) {
      this.sequence.push(start + i * step);
    }
    this.sequenceAnswer = start + length * step;
  }

  private generateColorCaptcha(): void {
    const shuffled = [...this.allColors].sort(() => Math.random() - 0.5);
    this.colorOptions = shuffled.slice(0, 4);
    const target = this.colorOptions[Math.floor(Math.random() * this.colorOptions.length)];
    this.targetColor = target.name;
    this.targetColorHex = target.hex;
  }

  private generateWordCaptcha(): void {
    const groups = [
      { category: 'fruita', words: ['Poma', 'Pera', 'Maduixa', 'Plàtan', 'Raïm'], odd: ['Cotxe', 'Taula', 'Llapis', 'Porta'] },
      { category: 'animal', words: ['Gat', 'Gos', 'Ocell', 'Peix', 'Lleó'], odd: ['Cotxe', 'Casa', 'Llapis', 'Porta'] },
      { category: 'color', words: ['Vermell', 'Blau', 'Verd', 'Groc', 'Morat'], odd: ['Gat', 'Taula', 'Pedra', 'Porta'] },
      { category: 'vehicle', words: ['Cotxe', 'Moto', 'Bici', 'Camió', 'Tren'], odd: ['Poma', 'Gat', 'Llapis', 'Porta'] },
    ];
    const group = groups[Math.floor(Math.random() * groups.length)];
    const groupWords = group.words.sort(() => Math.random() - 0.5).slice(0, 3);
    const oddWord = group.odd[Math.floor(Math.random() * group.odd.length)];
    this.oddWord = oddWord;
    this.wordOptions = [...groupWords, oddWord].sort(() => Math.random() - 0.5);
  }

  validate(): boolean {
    let correct = false;
    switch (this.captchaType) {
      case 'math': correct = parseInt(this.userInput.trim(), 10) === this.mathAnswer; break;
      case 'text': correct = this.userInput.trim().toUpperCase() === this.captchaText; break;
      case 'sequence': correct = parseInt(this.userInput.trim(), 10) === this.sequenceAnswer; break;
      case 'color': correct = this.selectedColor === this.targetColor; break;
      case 'word': correct = this.selectedWord === this.oddWord; break;
    }
    this.isValid = correct;
    this.showError = !correct;
    this.captchaValidated.emit(correct);
    if (!correct) setTimeout(() => this.generateCaptcha(), 1200);
    return correct;
  }

  selectColor(color: { name: string; hex: string }): void { this.selectedColor = color.name; this.showError = false; }
  selectWord(word: string): void { this.selectedWord = word; this.showError = false; }
  refresh(): void { this.generateCaptcha(); this.captchaValidated.emit(false); }
}
