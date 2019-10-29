import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { LoggerService } from '../../services/logger/logger.service';
import * as fromActions from '../../store';
import { Store, select } from '@ngrx/store';
import {NavItemsModel} from '../../models/nav-item.model';
import {AppTitleModel} from '../../models/app-title.model';
import {UserNavModel} from '../../models/user-nav.model';
import {AppConstants} from '../../app.constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'exui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  navItems: NavItemsModel[];
  appHeaderTitle: AppTitleModel;
  userNav: UserNavModel;
  componentName = 'App Component';
  plainView: boolean;
  dataSubscription$: Subscription;

  constructor(
    private logger: LoggerService,
    private store: Store<fromActions.State> ) {
  }

  ngOnInit(): void {
    this.plainView = false;
    this.appHeaderTitle = AppConstants.APP_HEADER_TITLE;
    this.navItems = AppConstants.NAV_ITEMS;
    this.userNav = AppConstants.USER_NAV;
    this.dataSubscription$ = this.store.pipe(select(fromActions.getRouterData))
      .subscribe(data => this.plainView = data ? data.plainView : false);
  }

  onNavigate(event): void {
    if (event === 'sign-out') {
      return this.store.dispatch(new fromActions.Logout());
    }
  }

}
