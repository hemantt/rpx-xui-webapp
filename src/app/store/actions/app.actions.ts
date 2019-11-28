import { TCDocument } from '@hmcts/rpx-xui-common-lib';
import { Action } from '@ngrx/store';

export const APP_LOAD_CONFIG = '[App] Load Config';
export const APP_LOAD_CONFIG_SUCCESS = '[App] Load Config Success';
export const APP_LOAD_CONFIG_FAIL = '[App] Load Config Fail';

export const START_APP_INITIALIZER = '[App] Start App initializer';
export const FINISH_APP_INITIALIZER = '[App] Finish Start App initializer';

export const LOGOUT = '[App] Logout';

export const LOAD_HAS_ACCEPTED_TC = '[T&C] Lad Has Accepted';
export const LOAD_HAS_ACCEPTED_TC_SUCCESS = '[T&C] Lad Has Accepted Success';
export const LOAD_HAS_ACCEPTED_TC_FAIL = '[T&C] Lad Has Accepted Fail';

export const ACCEPT_T_AND_C = '[T&C] Accept T&C';
export const ACCEPT_T_AND_C_SUCCESS = '[T&C] Accept T&C Success';
export const ACCEPT_T_AND_C_FAIL = '[T&C] Accept T&C Fail';

export const LOAD_TERMS_CONDITIONS = '[TC] Load Terms Conditions';
export const LOAD_TERMS_CONDITIONS_SUCCESS = '[TC] Load Terms Conditions Success';
export const LOAD_TERMS_CONDITIONS_FAIL = '[TC] Load Terms Conditions Fail';


export class LoadConfig implements Action {
  readonly type = APP_LOAD_CONFIG;
}

export class LoadConfigSuccess implements Action {
  readonly type = APP_LOAD_CONFIG_SUCCESS;
  constructor(public payload: any) { }
}

export class LoadConfigFail implements Action {
  readonly type = APP_LOAD_CONFIG_FAIL;
  constructor(public payload: any) { }
}

export class StartAppInitilizer implements Action {
  readonly type = START_APP_INITIALIZER;
}

export class FinishAppInitilizer implements Action {
  readonly type = FINISH_APP_INITIALIZER;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoadHasAcceptedTC implements Action {
  constructor(public payload: string) {}
  readonly type = LOAD_HAS_ACCEPTED_TC;
}

export class LoadHasAcceptedTCSuccess implements Action {
  readonly type = LOAD_HAS_ACCEPTED_TC_SUCCESS;
  constructor(public payload: boolean) {}
}

export class LoadHasAcceptedTCFail implements Action {
  readonly type = LOAD_HAS_ACCEPTED_TC_FAIL;
  constructor(public payload: boolean) {}
}

export class AcceptTandC implements Action {
  readonly type = ACCEPT_T_AND_C;
  constructor(public payload: string) {}
}

export class AcceptTandCSuccess implements Action {
  readonly type = ACCEPT_T_AND_C_SUCCESS;
  constructor(public payload: boolean) {}
}

export class AcceptTandCFail implements Action {
  readonly type = ACCEPT_T_AND_C_FAIL;
  constructor(public payload: boolean) {}
}

export class LoadTermsConditions {
  public readonly type = LOAD_TERMS_CONDITIONS;
}

export class LoadTermsConditionsSuccess {
  public readonly type = LOAD_TERMS_CONDITIONS_SUCCESS;
  constructor(public payload: TCDocument) {}
}

export class LoadTermsConditionsFail {
  public readonly type = LOAD_TERMS_CONDITIONS_FAIL;
  constructor(public payload: any) {}
}

export type AppActions =
  | LoadConfig
  | LoadConfigSuccess
  | LoadConfigFail
  | StartAppInitilizer
  | FinishAppInitilizer
  | Logout
  | LoadHasAcceptedTC
  | LoadHasAcceptedTCSuccess
  | LoadHasAcceptedTCFail
  | AcceptTandC
  | AcceptTandCFail
  | AcceptTandCSuccess
  | LoadTermsConditions
  | LoadTermsConditionsFail
  | LoadTermsConditionsSuccess;
