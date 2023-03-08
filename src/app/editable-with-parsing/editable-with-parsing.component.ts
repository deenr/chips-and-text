import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";

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
  ];

  public value = "";
  public caretIndex = 0;
  public textIndex = 0;
  public lineIndex = 0;
  public totalLengthTillBeginningOfText = 0;

  public ngOnInit(): void {
    this.getValue();
  }

  public onClickOutsideText(event: Event): void {
    const lineIndex = this.data.length - 1;
    this.setCursorIndex(lineIndex, this.data[lineIndex].length, true);
  }

  public onBlur(event: Event): void {
    const newText = (
      (event.target as HTMLInputElement).children[
        this.lineIndex
      ] as HTMLInputElement
    ).innerText
      .split(/\n/g)
      .filter((text: string) => text !== "cancel")[this.textIndex];
    this.data[this.lineIndex][this.textIndex].value = newText;

    this.getValue();
  }

  public setCursorIndex(
    lineIndex: number,
    itemIndex: number,
    cursorOnChip: boolean = false
  ): void {
    let textLength = 0;

    for (let index = 0; index < lineIndex; index++) {
      textLength =
        textLength +
        this.data[index]
          .map((text: { type: string; value: string }) => text.value.length)
          .reduce(
            (previousValue: number, currentValue: number) =>
              previousValue + currentValue
          );
    }

    for (let index = 0; index < itemIndex; index++) {
      textLength = textLength + this.data[lineIndex][index].value.length;
    }
    this.caretIndex = cursorOnChip
      ? textLength + 1
      : textLength + this.getCaretPosition();

    this.getTextAndLineIndexAtCaretPosition();
    this.getValue();
  }

  public removeChip(lineIndex: number, itemIndex: number): void {
    const textBeforeChip = this.data[lineIndex][itemIndex - 1];
    const textAfterChip = this.data[lineIndex][itemIndex + 1];
    if (textBeforeChip) {
      textBeforeChip.value = `${textBeforeChip?.value} ${textAfterChip?.value}`;
      this.data[lineIndex].splice(itemIndex + 1, 1);
    }
    this.data[lineIndex].splice(itemIndex, 1);
    this.getValue();
  }

  private getTextAndLineIndexAtCaretPosition(): void {
    let totalLength = 1;
    lineloop: for (
      let lineIndex = 0;
      lineIndex < this.data.length;
      lineIndex++
    ) {
      for (
        let textIndex = 0;
        textIndex < this.data[lineIndex].length;
        textIndex++
      ) {
        let text = this.data[lineIndex][textIndex].value;
        console.log(this.caretIndex, "<", totalLength, "+", text.length);
        console.log(text);
        if (this.caretIndex < totalLength + text.length + 1) {
          this.lineIndex = lineIndex;
          this.textIndex = textIndex;
          this.totalLengthTillBeginningOfText = totalLength;
          break lineloop;
        } else if (
          this.caretIndex === totalLength + text.length &&
          textIndex === this.data[lineIndex].length - 1
        ) {
          this.lineIndex = lineIndex;
          this.textIndex = textIndex;
          this.totalLengthTillBeginningOfText = totalLength;
        }
        totalLength = totalLength + text.length;
      }
    }
  }

  public onOptionSelect(option: string) {
    const indexToSplitText =
      this.caretIndex - this.totalLengthTillBeginningOfText;
    const text = this.data[this.lineIndex][this.textIndex].value;
    const firstPart = text.slice(0, indexToSplitText);
    const secondPart = text.slice(indexToSplitText, text.length);
    this.data[this.lineIndex][this.textIndex].value = firstPart;
    this.data[this.lineIndex].splice(this.textIndex + 1, 0, {
      type: "chip",
      value: option,
    });
    this.data[this.lineIndex].splice(this.textIndex + 2, 0, {
      type: "text",
      value: secondPart,
    });

    const newVariable = `%{${option}}%`;
    this.caretIndex = this.caretIndex + newVariable.length;

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
