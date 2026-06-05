import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Chart, ChartType, ChartData, ChartOptions, registerables } from 'chart.js';

// Enregistrer tous les composants Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  template: `
    <div class="relative">
      <canvas #chartCanvas></canvas>
    </div>`
})

export class Charts implements OnInit, OnDestroy {

  @ViewChild('chartCanvas', { static: true} ) chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() type:    ChartType = 'bar';
  @Input() data!:   ChartData;
  @Input() options: ChartOptions = {};

  private chart!: Chart;

  ngOnInit(): void {
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type:    this.type,
      data:    this.data,
      options: this.options
    });
  }

  ngOnDestroy(): void {
    // évite les fuites de mémoire
    this.chart?.destroy();
  }
}
