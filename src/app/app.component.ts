import { Component, OnInit } from '@angular/core';
import { Security } from "./models/security";
import { SecurityService } from "./services/security.service";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { indicate } from "./utils";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public securities$: Observable<Security[]>;
  public loadingSecurities$: Subject<boolean> = new BehaviorSubject<boolean>(false);
  public displayedColumns: string[] = ["name", "type", "currency"];

  constructor(private securityService: SecurityService) { }

  ngOnInit(): void {
    this.securities$ = this.securityService.getSecurities()
      .pipe(indicate(this.loadingSecurities$));
  }
}
