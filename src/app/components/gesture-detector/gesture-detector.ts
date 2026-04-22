import { Component, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as tmImage from '@teachablemachine/image';
import { Usuaris } from '../../serveis/usuaris';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gesture-detector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gesture-detector.html',
  styleUrls: ['./gesture-detector.css']
})
export class GestureDetectorComponent implements OnDestroy {
  @Output() badGestureDetected = new EventEmitter<string>();

  MODEL_URL = '/assets/my_model/';
  model: any;
  webcam: any;
  isRunning = false;
  isVisible = true;
  currentLabel = '';
  confidence = 0;

  BAD_GESTURES = ['gesto_feo', 'dedo'];

  constructor(
    private cdr: ChangeDetectorRef,
    private usuaris: Usuaris,
    private router: Router
  ) {}

  async startDetection() {
    const modelURL = this.MODEL_URL + 'model.json';
    const metadataURL = this.MODEL_URL + 'metadata.json';

    this.model = await tmImage.load(modelURL, metadataURL);
    this.webcam = new tmImage.Webcam(300, 300, true);
    await this.webcam.setup();
    await this.webcam.play();

    const container = document.getElementById('webcam-container');
    if (container) container.appendChild(this.webcam.canvas);

    this.isRunning = true;
    this.cdr.detectChanges();
    this.loop();
  }

  async loop() {
    if (!this.isRunning) return;
    this.webcam.update();
    await this.predict();
    this.cdr.detectChanges();
    requestAnimationFrame(() => this.loop());
  }

  async predict() {
    const predictions = await this.model.predict(this.webcam.canvas);
    const top = predictions.reduce((a: any, b: any) =>
      a.probability > b.probability ? a : b
    );
    this.currentLabel = top.className;
    this.confidence = Math.round(top.probability * 100);

    if (this.BAD_GESTURES.includes(top.className) && top.probability > 0.85) {
      this.badGestureDetected.emit(top.className);

      const sesionActiva = sessionStorage.getItem('currentUserNom');
      if (sesionActiva) {
        this.stopDetection();
        this.usuaris.logout();
        this.router.navigate(['/']);
      }
    }
  }

  stopDetection() {
    this.isRunning = false;
    if (this.webcam) this.webcam.stop();
    const container = document.getElementById('webcam-container');
    if (container) container.innerHTML = '';
    this.cdr.detectChanges();
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  ngOnDestroy() {
    this.stopDetection();
  }
}
