import { Injectable, Optional } from '@angular/core';
import * as Common from '@microsoft/applicationinsights-common';
import {ICustomProperties} from '@microsoft/applicationinsights-core-js';
import { AppInsights } from 'applicationinsights-js';
import { HttpClient } from '@angular/common/http';
// import { AbstractAppInsights} from './appInsightsWrapper';
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

export interface IMonitoringService {
  logPageView(name?: string, url?: string, properties?: any,
              measurements?: any, duration?: number);
  logEvent(name: string, properties?: any, measurements?: any);
  logException(exception: Error);
}

export class MonitorConfig implements Microsoft.ApplicationInsights.IConfig {
  instrumentationKey?: string;
  endpointUrl?: string;
  emitLineDelimitedJson?: boolean;
  accountId?: string;
  sessionRenewalMs?: number;
  sessionExpirationMs?: number;
  maxBatchSizeInBytes?: number;
  maxBatchInterval?: number;
  enableDebug?: boolean;
  disableExceptionTracking?: boolean;
  disableTelemetry?: boolean;
  verboseLogging?: boolean;
  diagnosticLogInterval?: number;
  samplingPercentage?: number;
  autoTrackPageVisitTime?: boolean;
  disableAjaxTracking?: boolean;
  overridePageViewDuration?: boolean;
  maxAjaxCallsPerView?: number;
  disableDataLossAnalysis?: boolean;
  disableCorrelationHeaders?: boolean;
  correlationHeaderExcludedDomains?: string[];
  disableFlushOnBeforeUnload?: boolean;
  enableSessionStorageBuffer?: boolean;
  isCookieUseDisabled?: boolean;
  cookieDomain?: string;
  isRetryDisabled?: boolean;
  url?: string;
  isStorageUseDisabled?: boolean;
  isBeaconApiDisabled?: boolean;
  sdkExtension?: string;
  isBrowserLinkTrackingEnabled?: boolean;
  appId?: string;
  enableCorsCorrelation?: boolean;
}



@Injectable()
export class MonitoringService implements IMonitoringService {

  constructor(private http: HttpClient, @Optional() private config?: MonitorConfig,
              @Optional() private appInsights?: ApplicationInsights) {
                if (!appInsights) {
                appInsights = new ApplicationInsights({ config: {
                    instrumentationKey: '3e01926b-51d7-477e-a94b-702c9c4a8768'
                  } });
              }
            }


  logPageView(name?: string, uri?: string, properties?: any,
              measurements?: any, duration?: number) {
    this.send(() => {
      const obj = {
        name,
        uri,
        refUri: uri,
        pageType: null,
        isLoggedIn: true,
        properties: {
          duration
        }
      }

      this.appInsights.trackPageView(obj);
    });
  }

  logEvent(name: string, properties?: any, measurements?: any) {
    this.send(() => {
      const event = {
        name
      }
      this.appInsights.trackEvent(event, properties);
    });
  }

  logException(exception: Error) {
    this.send(() => { this.appInsights.trackException({
      exception
    });
    });
  }

  private send(func: () => any): void {
    if (this.config && this.config.instrumentationKey) {
      func();
    } else {
      this.http.get('/api/monitoring-tools').subscribe(it => {
        this.config = {
          // tslint:disable-next-line: no-string-literal
          instrumentationKey: it['key']
        };
        if (!this.appInsights.config) {
          // this.appInsights.downloadAndSetup(this.config);
        }
        func();
      });
    }
  }
}
