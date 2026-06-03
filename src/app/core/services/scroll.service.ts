import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  
  hide(): void {
    document.body.classList.add('no-scroll');
  }

  show(): void {
    document.body.classList.remove('no-scroll');
  }
}
