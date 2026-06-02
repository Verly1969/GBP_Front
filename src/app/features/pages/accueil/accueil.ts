import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Footer } from '../../../shared/components/footer/footer';

@Component({
  selector: 'app-accueil',
  imports: [
    Header,
    Footer
],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil {

}
