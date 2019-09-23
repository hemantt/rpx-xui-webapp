import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Actions } from '@ngrx/effects';

import { hot, cold } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';

import * as fromEffects from './case-create.effects';
import * as fromActions from '../actions/create-case.action';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '@hmcts/ccd-case-ui-toolkit';
import { Router } from '@angular/router';

export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}
let mockAlertService: any;
let mockLogger: any;
describe('CaseCreate Effects', () => {
  let actions$: TestActions;
  let effects: fromEffects.CaseCreateEffects;
  mockAlertService = jasmine.createSpyObj('alertService', ['success']);
  mockLogger = jasmine.createSpyObj('mockLogger', ['info']);
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        fromEffects.CaseCreateEffects,
        {provide: AlertService, useClass: mockAlertService},
        { provide: Actions, useFactory: getActions },
      ],
    });
    actions$ = TestBed.get(Actions);
    router = TestBed.get(Router);
    router.initialNavigation();
    effects = new fromEffects.CaseCreateEffects(actions$, mockAlertService, router, mockLogger);

  });

  describe('loadToppings$', () => {
    it('should return a collection from LoadToppingsSuccess', () => {
      expect(effects).toBeTruthy();
    });
  });
});
