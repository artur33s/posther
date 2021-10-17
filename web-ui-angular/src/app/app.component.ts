import { Component, HostListener, OnInit } from '@angular/core';
import { Web3ErrorService } from './web3-error.service';
import { Web3Service } from './web3.service';
import { NavMenuService } from './navbar/nav-menu.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Posther';

  @HostListener('click') onClicks() {
    this.navMenuSvc.closeMenu();
  }
  constructor(
    public web3Svc: Web3Service,
    public errorSvc: Web3ErrorService,
    private navMenuSvc: NavMenuService
  ) {}
}
