import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Footer } from '../../shared/components/footer/footer';
import { ScrollService } from '../../core/services/scroll.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    Footer
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {

  private readonly scrollService = inject(ScrollService);

  ngOnInit(): void {
    this.scrollService.hide();
  }

  ngOnDestroy(): void {
    this.scrollService.show();
  }
}
