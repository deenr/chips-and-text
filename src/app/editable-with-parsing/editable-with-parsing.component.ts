import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: "app-editable-with-parsing",
  templateUrl: "./editable-with-parsing.component.html",
  styleUrls: ["./editable-with-parsing.component.css"],
})
export class EditableWithParsingComponent {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  editableContent: any;
  @ViewChild("editable") editableContentText: ElementRef;

  value = "";
  cursorIndex = 0;

  showAutocomplete = false;

  onKeyUp() {
    this.value = this.editableContentText.nativeElement.innerText;
    this.cursorIndex = window.getSelection()!.focusOffset;
  }

  onClick() {
    this.cursorIndex = window.getSelection()!.focusOffset;
  }

  onOptionSelect(option: string) {
    console.log(option, this.value);
    const newVariable = `%{${option}}%`;
    this.value =
      this.value.slice(0, this.cursorIndex) +
      newVariable +
      this.value.slice(this.cursorIndex);

    this.cursorIndex = this.cursorIndex + newVariable.length;
    this.editableContentText.nativeElement.innerText = this.value;
  }

  autcompleteData = [
    { id: "0", name: "Machine name" },
    { id: "1", name: "Weave product" },
    { id: "2", name: "Machine type" },
  ];
}
