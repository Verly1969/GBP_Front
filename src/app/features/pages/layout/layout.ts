import { Component } from '@angular/core';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { Header } from "../../../shared/components/header/header";

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    Sidebar,
    Header
],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
}
