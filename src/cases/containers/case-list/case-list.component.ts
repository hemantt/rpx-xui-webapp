import {Component, OnInit, ViewEncapsulation} from '@angular/core';

/**
 * Entry component wrapper for Case List
 * Smart Component
 * param TBC
 */
@Component({
  selector: 'exui-create-case',
  template: `
    <exui-page-wrapper [title]="'Case List'">
    <a routerLink="/cases/case-filter" class="button">Create case</a>
    </exui-page-wrapper>
  `,
  encapsulation: ViewEncapsulation.None
})
export class CaseListComponent {
  constructor() {}

}
