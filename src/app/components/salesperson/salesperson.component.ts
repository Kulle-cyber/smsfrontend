import { Component } from '@angular/core';

@Component({
  selector: 'app-salesperson',
  templateUrl: './salesperson.component.html',
  styleUrls: ['./salesperson.component.scss']
})
export class SalespersonComponent {
  activeMenu: string = 'create-orders';

  setActive(menu: string) {
    this.activeMenu = menu;
  }
}
