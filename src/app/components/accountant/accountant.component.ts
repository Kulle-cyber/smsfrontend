import { Component } from '@angular/core';

@Component({
  selector: 'app-accountant',
  templateUrl: './accountant.component.html',
  styleUrls: ['./accountant.component.scss']
})
export class AccountantComponent {
  activeMenu: string = 'invoices';

  setActive(menu: string) {
    this.activeMenu = menu;
  }
}
