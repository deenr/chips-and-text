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
  @ViewChild("editable") editableContentText: ElementRef;

  value = "";
  formattedValue = "";
  cursorIndex = 0;

  showAutocomplete = false;

  onKeyUp(index: number): void {
    this.data[index].value =
      this.editableContentText.nativeElement.children[index].innerText;
    this.setCursorIndex(index);
    this.getFormattedValue();
  }

  setCursorIndex(index: number): void {
    let textLength = 0;
    for (let i = 0; i < index; i++) {
      textLength = textLength + this.data[i].value.length;
    }
    this.cursorIndex = textLength + this.getCaretPosition();
    this.getFormattedValue();
  }

  getCaretPosition(): number {
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
      const selection = window.getSelection()!;
      if (selection.rangeCount !== 0) {
        const range = selection.getRangeAt(0).cloneRange();
        return range.endOffset;
      }
    }
    return 0;
  }

  removeChip(index: number): void {
    if (this.data[index - 1]) {
      this.data[index - 1].value = `${this.data[index - 1]?.value} ${
        this.data[index + 1]?.value
      }`;
      this.data.splice(index + 1, 1);
    }
    this.data.splice(index, 1);
    this.getFormattedValue();
  }

  onOptionSelect(option: string) {
    const newVariable = `%{${option}}%`;

    let totalTextLength = 0;
    let textToSplitIndex = -1;
    for (let i = 0; i < this.data.length; i++) {
      const text = this.data[i].value;
      if (this.cursorIndex < totalTextLength + text.length) {
        textToSplitIndex = i;
        break;
      }
      totalTextLength = totalTextLength + text.length;
    }

    const newChip = { type: "chip", value: option };
    if (textToSplitIndex !== -1) {
      console.log(totalTextLength);
      const indexToSplitText = this.cursorIndex - totalTextLength - 1;
      const text = this.data[textToSplitIndex].value;
      const firstPart = text.slice(0, indexToSplitText);
      const secondPart = text.slice(indexToSplitText, text.length);
      this.data[textToSplitIndex].value = firstPart;
      this.data.splice(textToSplitIndex + 1, 0, newChip);
      this.data.splice(textToSplitIndex + 2, 0, {
        type: "text",
        value: secondPart,
      });
      console.log(text, "=", firstPart, "+", secondPart);
    } else {
      this.data.push(newChip);
      this.data.push({ type: "text", value: "" });
    }
    this.getFormattedValue();
    this.cursorIndex = this.cursorIndex + newVariable.length;
  }

  public getFormattedValue(): void {
    this.formattedValue = this.data
      .map((data: { type: string; value: string }) => {
        if (data.type === "text") {
          return data.value;
        } else {
          return `%{${this.getVariableIdByName(data.value)}}%`;
        }
      })
      .join(" ");
  }

  public getVariableIdByName(name: string): number | undefined {
    return this.variableData.find(
      (variable: { id: number; name: string }) => variable.name === name
    )?.id;
  }

  variableData = [
    { id: 0, name: "Machine name" },
    { id: 1, name: "Weave product" },
    { id: 2, name: "Actual temperature" },
  ];

  data: {
    type: string;
    value: string;
  }[] = [
    { type: "text", value: "The tempature of" },
    { type: "chip", value: "Machine name" },
    { type: "text", value: "is too high." },
    { type: "chip", value: "Machine name" },
    { type: "text", value: "is too high." },
  ];
}
