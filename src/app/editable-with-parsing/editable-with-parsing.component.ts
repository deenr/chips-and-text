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
export class EditableWithParsingComponent implements OnInit {
  @ViewChild("editableDiv") public readonly editableDiv: ElementRef;

  public readonly variableData = [
    { id: 0, name: "Machine name" },
    { id: 1, name: "Weave product" },
    { id: 2, name: "Actual temperature" },
  ];

  public data: {
    type: string;
    value: string;
  }[] = [
    { type: "text", value: "The tempature of" },
    { type: "chip", value: "Machine name" },
    { type: "text", value: "is too high." },
    { type: "chip", value: "Machine name" },
    { type: "text", value: "is too high." },
  ];

  public value = "";
  public cursorIndex = 0;

  public ngOnInit(): void {
    this.getValue();
  }

  public onInputChange(event: Event, index: number): void {
    console.log();
    this.data[index].value = (event.target as HTMLInputElement).innerText;
    this.setCursorIndex(index);
  }

  public setCursorIndex(index: number, cursorOnChip: boolean = false): void {
    let textLength = 0;
    for (let i = 0; i < index; i++) {
      textLength = textLength + this.data[i].value.length;
    }
    this.cursorIndex = cursorOnChip
      ? textLength + 1
      : textLength + this.getCaretPosition();

    console.log(this.cursorIndex);
    this.getValue();
  }

  public removeChip(index: number): void {
    if (this.data[index - 1]) {
      this.data[index - 1].value = `${this.data[index - 1]?.value} ${
        this.data[index + 1]?.value
      }`;
      this.data.splice(index + 1, 1);
    }
    this.data.splice(index, 1);
    this.getValue();
  }

  public onOptionSelect(option: string) {
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
    this.getValue();
    this.cursorIndex = this.cursorIndex + newVariable.length;
  }

  public focusOnLastSpan(): void {
    this.editableDiv.nativeElement.children[
      this.editableDiv.nativeElement.children.length - 1
    ].focus();
    this.setCursorIndex(this.data.length, true);
  }

  private getValue(): void {
    this.value = this.data
      .map((data: { type: string; value: string }) => {
        if (data.type === "text") {
          return data.value;
        } else {
          return `%{${this.getVariableIdByName(data.value)}}%`;
        }
      })
      .join(" ");
  }

  private getVariableIdByName(name: string): number | undefined {
    return this.variableData.find(
      (variable: { id: number; name: string }) => variable.name === name
    )?.id;
  }

  private getCaretPosition(): number {
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
}
