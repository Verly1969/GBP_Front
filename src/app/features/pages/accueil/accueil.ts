import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ScrollService } from '../../../core/services/scroll.service';
import { Footer } from '../../../shared/components/footer/footer';

@Component({
  selector: 'app-accueil',
  imports: [
    Footer
],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit, OnDestroy {

  private readonly scrollService = inject(ScrollService);

  ngOnInit(): void    { this.scrollService.hide(); }
  ngOnDestroy(): void { this.scrollService.show(); }
}
