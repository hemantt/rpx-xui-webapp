import { CaseHomeComponent } from './containers/case-home/case-home.component';
// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { CaseListComponent } from './containers/case-list/case-list.component';
import { CaseFilterComponent } from './containers/case-filter/case-filter.component';

import { CaseSearchComponent } from './containers/case-search/case-search.component';
import {CasesCreateComponent } from './containers';
import {viewerRouting as caseViewRouting, editorRouting, CaseResolver} from '@hmcts/ccd-case-ui-toolkit';
import {CaseDetailsComponent} from './containers/case-details/case-details.component';
import { HealthCheckGuard } from 'src/app/shared/guards/health-check.guard';
import { CreateCaseEventTriggerResolver } from './resolvers/create-case-event-trigger.resolver';
import { CaseCreatorSubmitComponent } from './components';

export const ROUTES: Routes = [
    {
      path: '',
      component: CaseHomeComponent,
      children: [
        {
          path: '',
          component: CaseListComponent,
          canActivate: [ HealthCheckGuard ]
        },
        {
          path: 'case-filter',
          component: CaseFilterComponent,
          canActivate: [ HealthCheckGuard ]
        },
        {
          path: 'case-create',
          // component: CasesCreateComponent,
          // children: editorRouting,
          children: [
            {
              path: '',
              component: CasesCreateComponent
            },
            {
              path: ':jid/:ctid/:eid',
              component: CaseCreatorSubmitComponent,
              resolve: {
                eventTrigger: CreateCaseEventTriggerResolver
              },
              children: editorRouting
            }
          ],
          canActivate: [ HealthCheckGuard ]
        },
        /**
         * { path: 'create/case',
         *   children: [
         *     {
         *       path: '',
         *       component: CaseCreatorComponent
         *     },
         *     {
         *       path: ':jid/:ctid/:eid',
         *       component: CaseCreatorSubmitComponent,
         *       resolve: {
         *         eventTrigger: CreateCaseEventTriggerResolver
         *       },
         *       children: caseEditRouting
         *     }
         *   ]
         * },
         */
        {
          path: 'case-search',
          component: CaseSearchComponent,
          children: editorRouting,
          canActivate: [ HealthCheckGuard ]
        },
        {
          path: 'case-details/:cid',
          resolve: {
            case: CaseResolver
          },
          runGuardsAndResolvers: 'always',
          children: caseViewRouting,
          canActivate: [ HealthCheckGuard ]
        }
      ]
    },


];

export const casesRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);

