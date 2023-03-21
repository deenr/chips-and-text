import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DemoMaterialModule} from './app/material-module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {ChipsAutocompleteExample} from './app/chips-autocomplete-example';
import {EditableWithParsingComponent} from './app/old-elements/editable-with-parsing/editable-with-parsing.component';
import {TextAreaWithChipsComponent} from './app/old-elements/text-area-with-chips/text-area-with-chips.component';
import {ChipInputComponent} from './app/old-elements/chip-input/chip-input.component';
import {EditableDivInputComponent} from './app/editable-div-input/editable-div-input.component';

// Default MatFormField appearance to 'fill' as that is the new recommended approach and the
// `legacy` and `standard` appearances are scheduled for deprecation in version 10.
// This makes the examples that use MatFormField render the same in StackBlitz as on the docs site.
@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, FormsModule, HttpClientModule, DemoMaterialModule, MatNativeDateModule, ReactiveFormsModule],
  entryComponents: [ChipsAutocompleteExample],
  declarations: [ChipsAutocompleteExample, EditableWithParsingComponent, TextAreaWithChipsComponent, ChipInputComponent, EditableDivInputComponent],
  bootstrap: [ChipsAutocompleteExample],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {appearance: 'fill'}
    }
  ]
})
export class AppModule {}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
