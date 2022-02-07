import { Injectable } from '@angular/core';
import {delay, from, Observable, of, skip, take} from "rxjs";
import { Security } from "../models/security";
import { SECURITIES } from "../mocks/securities-mock";
import { SecuritiesFilter } from "../models/security";

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly _securities: Security[];

  constructor() {
    this._securities = SECURITIES;
  }

  /**
   * Get Securities server request mock:
   * */
  getSecurities(securityFilter?: SecuritiesFilter): Observable<Security[]> {
    const filteredSecurities = this.filterSecurities(securityFilter)
      .slice(securityFilter?.skip ?? 0, securityFilter?.limit ?? 100);

    return of(filteredSecurities).pipe(delay(1000));
  }

  private filterSecurities(securityFilter: SecuritiesFilter) {
    if (!securityFilter) return this._securities;

    return this._securities.filter(s =>
      (!securityFilter.name || s.name.includes(securityFilter.name))
      && (!securityFilter.types || securityFilter.types.some(type => s.type === type))
      && (!securityFilter.currencies || securityFilter.currencies.some(currency => s.currency == currency))
      && (securityFilter.isPrivate === undefined || securityFilter.isPrivate === s.isPrivate)
    );
  }
}
