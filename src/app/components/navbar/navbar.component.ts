import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  sidebarOpened = false; // optional state variable

  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
    // You can also add logic to emit an event to parent or handle sidebar state here
    console.log('Sidebar toggled:', this.sidebarOpened);
  }

}
