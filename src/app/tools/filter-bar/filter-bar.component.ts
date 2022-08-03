import {
  Component, EventEmitter, Input, OnDestroy, Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FBFormData } from './filter-bar.interface';
import { Subscription } from 'rxjs';


@Component({
  selector: 'filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBar<T> implements OnDestroy {
  /**
   * holding the data for building the form of filter-bar
   * - inputs always outputs a string type
   * - multiselects always outputs a string[] type
   * - checkbox always outputs a boolean type
   * - selects always outputs a string type (extending example)
   */
  @Input() public set filterFormData(filterFormData: FBFormData<T>) {
    this._filterFormData = filterFormData;

    this.buildForm();
  }
  public get filterFormData(): FBFormData<T> {
    return this._filterFormData;
  }

  /**
   * sends the filter form data for handling outside the filter bar
   */
  @Output() public filterFormOutput: EventEmitter<T> = new EventEmitter<T>();

  /**
   * the form group of reactive forms
   */
  public form?: FormGroup;

  public more: boolean = false;

  private sub = new Subscription();
  private _filterFormData!: FBFormData<T>;

  public constructor(
    private formBuilder: FormBuilder,
  ) { }

  public keepOriginalOrder = (a) => a.key

  /**
   * clean up
   */
  public ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.form = undefined;
  }

  /**
   * reset filter to default
   */
  public resetFilter(): void {
    this.filterFormOutput.emit(this.filterFormData.filterOutputType);
    this.buildForm();
    this.more = false;
  }

  /**
   * build form by filter form data (including all filter fields)
   */
  private buildForm(): void {
    // Building all Controls according the form field objects
    const formControls: { [key: string]: FormControl | FormGroup } = {};
    for (const key of Object.keys(this.filterFormData.filterFormFields)) {
      const formField = this.filterFormData.filterFormFields[key];

      if (formField) {
        switch (formField.type) {
          case 'input':
            formControls[key] = new FormControl('');
            break;
          case 'multiselect':
            const formControlsMS: { [key: string]: FormControl } = {};
            formField.options.forEach(i => formControlsMS[i] = new FormControl(false));
            formControls[key] = new FormGroup(formControlsMS);
            break;
          case 'checkbox':
            formControls[key] = new FormControl(undefined);
            break;
          case 'select':
            formControls[key] = new FormControl('');
            break;
          default:
            break;
        }
      }
    }
    this.form = this.formBuilder.group(formControls);

    // on form values changed
    this.sub.add(this.form.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        console.log('##### formValuesChanged');
        this.filterFormOutput.emit(this.getModifiedFormValues());
      }),
    );
  }

  /**
   * get raw values of form. modified when needed
   */
  private getModifiedFormValues(): T {
    const result = this.form?.getRawValue();

    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        const element = result[key];
        const formFields = this.filterFormData.filterFormFields;
        if (formFields[key]) {

          switch (formFields[key]?.type) {
            case 'input':
              // return of '' not applicable. return undefined instead.
              if (element === '') {
                result[key] = undefined;
              }
              break;
            case 'multiselect':
              // return multiselects always as array of strings
              const selections: string[] = []
              Object.keys(element).map(function (k) {
                if (element[k] === true) {
                  selections.push(k);
                }
              });
              // return of empty array not applicable. return undefined instead.
              result[key] = selections.length > 0 ? selections : undefined;
              break;
            case 'checkbox':
              // return of null not applicable. return undefined instead.
              if (element === null) {
                result[key] = undefined;
              }
              break;
            default:
              break;
          }

        }
      }
    }

    return result;
  }
}
