import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "vdw-text-area-with-chips",
  templateUrl: "./text-area-with-chips.component.html",
  styleUrls: ["./text-area-with-chips.component.scss"],
})
export class TextAreaWithChipsComponent implements OnInit {
  @ViewChild("editableDiv") public readonly editableDiv: ElementRef;
  @Input() public variableData: { id: number; name: string }[];
  @Input() public data: { type: string; value: string }[][];
  @Output() public valueChange: EventEmitter<string> =
    new EventEmitter<string>();

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

  public onKeyUp(event: KeyboardEvent): void {
    if (event.key === "Backspace") {
      this.removeChip(0, 3);
    }
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
    console.log(this.getCaretPosition());

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

  public onOptionSelect(option: string): void {
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
        const text = this.data[lineIndex][textIndex].value;
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

  private getValue(): void {
    this.valueChange.emit(
      this.data
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
        .join("\\n")
    );
  }

  private getVariableIdByName(name: string): number | undefined {
    return this.variableData.find(
      (variable: { id: number; name: string }) => variable.name === name
    )?.id;
  }

  private getCaretPosition(): number {
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount !== 0) {
        const range = selection.getRangeAt(0).cloneRange();
        return range.endOffset;
      }
    }
    return 0;
  }
}
