import { Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Charts } from '../../../shared/charts/charts';

@Component({
  selector: 'app-dashboard',
  imports: [
    Charts
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  // Graphique mensuel sur 12 mois
  lineData: ChartData = {
    labels: ['06-25', '07-25', '08-25', '09-25', '10-25', '11-25',
             '12-25', '01-26', '02-26', '03-26', '04-26', '05-26'],
    datasets: [
    // Recettes
    {
      label: 'Revenus',
      data: [4200, 3800, 5100, 4600, 5300, 4900, 5800, 4700, 5200,
             6100, 5500, 7200],
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4, // courbe lissée
      fill: true
    },
    // Dépenses
    {
      label: 'Dépenses',
      data: [3100, 2900, 3400, 3200, 3600, 3300, 3900, 3500, 3700,
             4200, 3800, 4500],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.5)',
      tension: 0.4, // courbe lissée
      fill: true
    },
    // Epargne
    {
      label: 'Epargne',
      data: [1100, 900, 1700, 1400, 1700, 1600, 1900, 1200, 1500,
             1900, 1700, 2700],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      tension: 0.4, // courbe lissée
      fill: true
    }]
  };

  lineOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#0c1a2c'}
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8'},
        grid: { color: 'rgba(255, 255, 255, 0.05'}
      },
      y: {
        ticks: { color: '#94a3b8'},
        grid: { color: 'rgba(255, 255, 255, 0.05'}
      }
    }
  }

  // Graphique tri par catégorie
  barData: ChartData = {
    labels: ['Immobilier', 'Véhicule', 'Générale', 'Divers'],
    datasets: [
      {
        data: [17240, 7327, 13361, 5172],
        backgroundColor: [
          'rgba(209, 237, 50, 0.7)',
          'rgba(17, 66, 58, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(59, 130, 246, 0.7)'
        ],
        borderColor: [
          'rgb(209, 237, 50)',
          'rgb(17, 66, 58)',
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)'
        ],
        borderWidth: 1
      }
    ]
  };

  barOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#0c1a2c' }
      }
    }
  }

  // Graphique pourcentage dépenses et épargne
  donutData: ChartData = {
    labels: ['Dépenses', 'Epargne'],
    datasets: [
      {
        data: [43100, 19300],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(59, 130, 246, 0.7)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)'
        ],
        borderWidth: 1
      }
    ]
  }

  donutOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#0c1a2c' }
      }
    }
  }
}
