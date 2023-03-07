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
import { ElementTextContentDirective } from "./element-text-content.directive";

@Component({
  selector: "app-content-editable",
  templateUrl: "./content-editable.component.html",
  styleUrls: ["./content-editable.component.css"]
})
export class ContentEditableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChildren(ElementTextContentDirective) textElements: QueryList<
    ElementTextContentDirective
  >;
  textElementDirectives: any[] = [];

  value = "";

  showAutocomplete = false;

  constructor() {}

  ngOnInit() {
    let element = document.querySelector("div[contenteditable]") as Node;
    let observer = new MutationObserver(mutations => {
      // console.log(mutations[0].oldValue, mutations[0].target.nodeValue);
      // this.replaceItem(mutations[0]);
      // if (this.textElementDirectives.length > 0) {
      //   let test = "";
      //   this.textElementDirectives.forEach(
      //     el => (test = test + " " + el.appElementTextContent)
      //   );
      //   this.value = test;
      // }
      // mutations.forEach((mutation, index) => {
      //   console.log(index, mutation.oldValue, mutation.target.nodeValue);
      //   this.replaceItem(mutation);
      //   if (this.textElementDirectives.length > 0) {
      //     let test = "";
      //     this.textElementDirectives.forEach(
      //       el => (test = test + " " + el.appElementTextContent)
      //     );
      //     this.value = test;
      //   }
      // });
    });

    observer.observe(element, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      characterDataOldValue: true
    });
  }

  whatIsThis(event: any) {
    console.log(event);
    console.log(event.target.innerText);
    this.value = event.target.innerText;
  }

  replaceItem(item: MutationRecord) {
    const el = this.data.filter(o => o.value === item.oldValue)[0];
    const index = this.data.indexOf(el);
    // console.log(item);
    if (el) {
      const newItem = {
        type: el.type,
        value: item.target.textContent || ""
      };
      this.data.splice(index, 1, newItem);
      if (!item) {
        this.data.splice(index, 1);
      }
    }
    // console.log(this.data);
  }

  ngAfterViewInit() {
    this.textElements.changes
      .pipe(startWith(this.textElements))
      .subscribe(els => {
        this.textElementDirectives = els.toArray();
        console.log(els.map((el: any) => el.appElementTextContent).join(" "));
      });
  }

  onKeyUp(data: KeyboardEvent) {
    if (data.key === "@") {
      this.trigger.openMenu();
    }
  }

  openMenu() {
    this.trigger.openMenu();
  }

  onOptionSelect(option: string) {}

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
