import { Component, OnInit } from '@angular/core';
import { Security } from "../../models/security";
import { BehaviorSubject, Observable } from "rxjs";
import { indicate } from "../../utils";
import { SecurityService } from "../../services/security.service";
import { FBFormData } from '../../tools/filter-bar/filter-bar.interface';
import { SecuritiesFilter } from 'src/app/models/securitiesFilter';

@Component({
  selector: 'securities-list',
  templateUrl: './securities-list.component.html',
  styleUrls: ['./securities-list.component.scss']
})
export class SecuritiesListComponent implements OnInit {
  public displayedColumns: string[] = ["name", "type", "currency"];

  public securities$: Observable<Security[]>;
  public loadingSecurities$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  // This filtering data could be delivered by a tiny backend request to get the options of multiselects
  public filterData: FBFormData<SecuritiesFilter> = {
    filterOutputType: {},
    filterFormFields: {
      "name": {
        type: 'input',
        label: 'Name',
      },
      "types": {
        type: 'multiselect',
        label: 'Types',
        options: ['Equity', 'Closed-endFund', 'BankAccount', 'DirectHolding', 'Generic', 'Collectible', 'Loan', 'RealEstate'],
      },
      "currencies": {
        type: 'multiselect',
        label: 'Currency',
        options: ['EUR', 'USD', 'GBP'],
      },
      "isPrivate": {
        type: 'checkbox',
        label: 'is Private?',
      },
    },
  };

  constructor(private securityService: SecurityService) { }

  ngOnInit(): void {
    this.securities$ = this.securityService.getSecurities({})
      .pipe(indicate(this.loadingSecurities$));
  }

  filterOutput(filter: SecuritiesFilter): void {
    this.securities$ = this.securityService.getSecurities(filter)
      .pipe(indicate(this.loadingSecurities$));
  }

}
