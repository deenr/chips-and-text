import {Component} from '@angular/core';
import {TextType} from './old-elements/text-area-with-chips/text-type.enum';

@Component({
  selector: 'chips-autocomplete-example',
  templateUrl: 'chips-autocomplete-example.html',
  styleUrls: ['chips-autocomplete-example.css']
})
export class ChipsAutocompleteExample {
  public variableData: {id: number; name: string}[] = [
    {id: 0, name: 'Machine name'},
    {id: 1, name: 'Actual temperature'},
    {id: 2, name: 'Actual RPM'}
  ];

  public data: {type: TextType; value: string}[][] = [
    [
      {type: TextType.TEXT, value: 'The temperature of'},
      {type: TextType.CHIP, value: 'Machine name'},
      {type: TextType.TEXT, value: 'was'},
      {type: TextType.CHIP, value: 'Actual temperature'},
      {type: TextType.TEXT, value: 'and was too high.'}
    ]
  ];

  public value = '';

  public onValueChange(newValue: string): void {
    this.value = newValue;
  }
}
/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
