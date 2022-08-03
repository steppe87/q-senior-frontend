import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { DataSource } from "@angular/cdk/collections";
import { MatColumnDef, MatHeaderRowDef, MatNoDataRow, MatRowDef, MatTable } from "@angular/material/table";
import { Observable } from "rxjs";
import { FBFormData } from 'src/app/tools/filter-bar/filter-bar.interface';

@Component({
  selector: 'filterable-table',
  templateUrl: './filterable-table.component.html',
  styleUrls: ['./filterable-table.component.scss'],
})
export class FilterableTableComponent<T, F> implements AfterContentInit {

  @ContentChildren(MatHeaderRowDef) headerRowDefs: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs: QueryList<MatRowDef<T>>;
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
  @ContentChild(MatNoDataRow) noDataRow: MatNoDataRow;

  @ViewChild(MatTable, {static: true}) table: MatTable<T>;

  @Input() columns: string[];

  @Input() dataSource: readonly T[] | DataSource<T> | Observable<readonly T[]>;
  @Input() isLoading: boolean;
  @Input() filterData: FBFormData<F>;

  @Output() filterOutput: EventEmitter<F> = new EventEmitter<F>();

  ngAfterContentInit() {
    this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
    this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
    this.headerRowDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));
    this.table.setNoDataRow(this.noDataRow);
  }

  filterBarOutput(data: F) {
    this.filterOutput.emit(data);
  }
}
