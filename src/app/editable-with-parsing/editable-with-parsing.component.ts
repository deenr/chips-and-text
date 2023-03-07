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
    { id: 1, name: "Actual temperature" },
    { id: 2, name: "Actual RPM" },
  ];

  public data: {
    type: string;
    value: string;
  }[][] = [
    [
      { type: "text", value: "The temperature of" },
      { type: "chip", value: "Machine name" },
      { type: "text", value: "was" },
      { type: "chip", value: "Actual temperature" },
      { type: "text", value: "and was too high." },
    ],
    [
      { type: "text", value: "In addition, the RPM was " },
      { type: "chip", value: "Actual RPM" },
      { type: "text", value: "which is too fast." },
    ],
  ];

  public value = "";
  public cursorIndex = 0;

  public ngOnInit(): void {
    this.getValue();
  }

  public onKeyUp(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      // event.preventDefault();
      console.log("hi");
    }
  }

  public onBlur(event: Event): void {
    // let textToEditIndex = -1;
    // [textToEditIndex] =
    //   this.getTextIndexThatWillBeEditedAndGetLengthTillThatText();
    // textToEditIndex =
    //   textToEditIndex === -1 ? this.data.length - 1 : textToEditIndex;
    // const newText = (event.target as HTMLInputElement).innerText
    //   .split(/\n/g)
    //   .filter((text: string) => text !== "cancel")[textToEditIndex];
    // this.data[textToEditIndex].value = newText;
  }

  public setCursorIndex(
    lineIndex: number,
    itemIndex: number,
    cursorOnChip: boolean = false
  ): void {
    let textLength = 0;

    for (let i = 0; i < lineIndex; i++) {
      textLength =
        textLength +
        this.data[i]
          .map((text: { type: string; value: string }) => text.value.length)
          .reduce(
            (previousValue: number, currentValue: number) =>
              previousValue + currentValue
          );
    }
    for (let i = 0; i < itemIndex; i++) {
      textLength = textLength + this.data[lineIndex][i].value.length;
    }

    this.cursorIndex = cursorOnChip
      ? textLength + 1
      : textLength + this.getCaretPosition();

    this.getValue();
  }

  public removeChip(index: number): void {
    // if (this.data[index - 1]) {
    //   this.data[index - 1].value = `${this.data[index - 1]?.value} ${
    //     this.data[index + 1]?.value
    //   }`;
    //   this.data.splice(index + 1, 1);
    // }
    // this.data.splice(index, 1);
    // this.getValue();
  }

  private getTextAndLineIndexAndTotalCharLengthAtCaretPosition(): [
    textIndex: number,
    lineIndex: number,
    totalTextLengthBeforeCaret: number
  ] {
    let totalLength = 0;
    let textIndex = -1;
    let lineIndex = -1;
    lineloop: for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].length; j++) {
        if (this.cursorIndex < totalLength + this.data[i][j].value.length) {
          lineIndex = i;
          textIndex = j;
          break lineloop;
        }
        totalLength = totalLength + this.data[i][j].value.length;
      }
    }
    console.log(textIndex, lineIndex, totalLength);
    return [textIndex, lineIndex, totalLength];
  }

  public onOptionSelect(option: string) {
    let totalTextLength = 0;
    let textToSplitIndex = -1;
    let lineIndex = -1;
    [textToSplitIndex, lineIndex, totalTextLength] =
      this.getTextAndLineIndexAndTotalCharLengthAtCaretPosition();

    const newChip = { type: "chip", value: option };
    if (textToSplitIndex !== -1 && lineIndex !== -1) {
      const indexToSplitText = this.cursorIndex - totalTextLength - 1;
      const text = this.data[lineIndex][textToSplitIndex].value;
      console.log(text);
      const firstPart = text.slice(0, indexToSplitText);
      const secondPart = text.slice(indexToSplitText, text.length);
      this.data[lineIndex][textToSplitIndex].value = firstPart;
      this.data[lineIndex].splice(textToSplitIndex + 1, 0, newChip);
      this.data[lineIndex].splice(textToSplitIndex + 2, 0, {
        type: "text",
        value: secondPart,
      });
    } else {
      this.data[this.data.length - 1].push(newChip);
      this.data[this.data.length - 1].push({ type: "text", value: "" });
    }
    this.getValue();
  }

  private getValue(): void {
    this.value = this.data
      .map((line: { type: string; value: string }[]) => {
        return line
          .map((value: { type: string; value: string }) => {
            if (value.type === "text") {
              return value.value;
            } else {
              return `%{${this.getVariableIdByName(value.value)}}%`;
            }
          })
          .join(" ");
      })
      .join("\\n");
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
