export interface FBFormData<T> {
  filterOutputType: T,
  filterFormFields: {
    [key: string]: FBFormInput | FBFormMultiSelect | FBFormCheckbox | FBFormSelect,
  }
}

export interface FBFormInput {
  type: 'input',
  label: string,
}

export interface FBFormMultiSelect {
  type: 'multiselect',
  label: string,
  options: string[],
}

export interface FBFormCheckbox {
  type: 'checkbox',
  label: string,
}

export interface FBFormSelect {
  type: 'select',
  label: string,
  options: string[],
}