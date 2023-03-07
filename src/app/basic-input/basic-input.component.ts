import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from "@angular/core";
import {
  MatAutocomplete,
  MatAutocompleteTrigger
} from "@angular/material/autocomplete";
import { MatMenuTrigger } from "@angular/material/menu";
import { startWith } from "rxjs/operators";
import { ElementTextContentDirective } from "../content-editable/element-text-content.directive";

@Component({
  selector: "app-basic-input",
  templateUrl: "./basic-input.component.html",
  styleUrls: ["./basic-input.component.css"]
})
export class BasicInputComponent implements OnInit, AfterViewInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChildren(ElementTextContentDirective) textElements: QueryList<
    ElementTextContentDirective
  >;

  value = "";

  showAutocomplete = false;

  index = 0;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {}

  onKeyUp(keyEvent: string, value: string, input: HTMLInputElement) {
    if (keyEvent === "@") {
      this.trigger.openMenu();
    }
    this.value = value;
    this.index = input.selectionEnd || 0;
    console.log(input.selectionStart, input.selectionEnd);
  }

  onOptionSelect(option: string) {
    this.value =
      this.value.slice(0, this.index) + option + this.value.slice(this.index);
  }

  onChange(event: any) {
    console.log(event);
  }

  openMenu() {
    this.trigger.openMenu();
  }

  data = [
    {
      type: "text",
      value: "This month"
    },
    {
      type: "chip",
      value: "@jlutz"
    },
    {
      type: "text",
      value: "and"
    },
    {
      type: "chip",
      value: "@jolewniczak"
    },
    {
      type: "text",
      value: "took PTO"
    }
  ];

  autcompleteData = [
    "@bkindle",
    "@cgatian",
    "@zream",
    "@jkang",
    "@jpu",
    "@lgatchell"
  ];
}
