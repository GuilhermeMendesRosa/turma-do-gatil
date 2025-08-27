import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PoHeaderModule, PoMenuItem, PoMenuModule} from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PoMenuModule, PoHeaderModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'turma-do-gatil-front';

  public menus: Array<PoMenuItem> = [
    {
      label: 'Gatos',
      icon: 'an an-cat',
      shortLabel: 'Timekeeping',
    },
    {
      label: 'Adoções',
      icon: 'an an-house-line',
      shortLabel: 'Timekeeping',
    },
    {
      label: 'Adotantes',
      icon: 'an an-users-three',
      shortLabel: 'Timekeeping',
    },
  ];
}
