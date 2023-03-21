import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TextType} from '../text-area-with-chips/text-type.enum';

@Component({
  selector: 'vdw-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss']
})
export class ChipInputComponent {
  @ViewChild('editableDiv') public readonly editableDiv: ElementRef;
  @Input() public variableData: {id: number; name: string}[];
  @Input() public data: {type: TextType; value: string}[][];
  @Output() public valueChange: EventEmitter<string> = new EventEmitter<string>();

  public readonly textType = TextType;
  public caretIndex: number;
  public lineIndex = 0;
  public textIndex: number;

  public onOptionSelect(option: string): void {
    const indexToSplitText = this.caretIndex - this.getLengthTillTextIndex(this.textIndex, TextType.TEXT) - 1;

    const text = this.data[this.lineIndex][this.textIndex].value;
    const firstPart = text.slice(0, indexToSplitText);
    const secondPart = text.slice(indexToSplitText, text.length);

    this.data[this.lineIndex][this.textIndex].value = firstPart;
    this.data[this.lineIndex].splice(this.textIndex + 1, 0, {
      type: TextType.CHIP,
      value: option
    });
    this.data[this.lineIndex].splice(this.textIndex + 2, 0, {
      type: TextType.TEXT,
      value: secondPart
    });

    const newVariable = `%{${option}}%`;
    this.caretIndex = this.caretIndex + newVariable.length;

    this.getValue();
  }

  public onBlur(event: Event): void {
    console.log(this.data, this.textIndex);
    const newText = ((event.target as HTMLInputElement).children[this.lineIndex] as HTMLInputElement).innerText.split(/\n/g).filter((text: string) => text !== 'cancel')[this.textIndex];
    this.data[this.lineIndex][this.textIndex].value = newText;

    this.getValue();
  }

  public onKeyUp(event: KeyboardEvent) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0).cloneRange();
      range.setStart(this.editableDiv.nativeElement.children[0].children[this.textIndex], 2);
    }
    if (event.key === 'Backspace') {
      if (this.getTextTypeByCaretIndex(this.caretIndex - 1) === TextType.CHIP) {
        this.textIndex = this.getTextIndexByCaretIndex(this.caretIndex, TextType.CHIP) - 1;
        this.caretIndex = this.caretIndex - this.data[this.lineIndex][this.textIndex].value.length;
        this.removeChip(this.textIndex);
        this.textIndex = this.textIndex - 1;
      } else {
        this.caretIndex = this.caretIndex - 1;
      }
    } else if (event.key === 'ArrowLeft') {
      if (this.getTextTypeByCaretIndex(this.caretIndex - 1) === TextType.CHIP) {
        this.textIndex = this.getTextIndexByCaretIndex(this.caretIndex, TextType.CHIP) - 1;
        this.caretIndex = this.caretIndex - this.data[this.lineIndex][this.textIndex].value.length;
        this.textIndex = this.textIndex - 1;
      } else {
        this.caretIndex = this.caretIndex - 1;
      }
    } else if (event.key === 'ArrowRight') {
      if (this.getTextTypeByCaretIndex(this.caretIndex + 1) === TextType.CHIP) {
        this.textIndex = this.getTextIndexByCaretIndex(this.caretIndex, TextType.CHIP);
        console.log(this.data[this.lineIndex][this.textIndex], this.data[this.lineIndex][this.textIndex].value);
        this.caretIndex = this.caretIndex + this.data[this.lineIndex][this.textIndex].value.length + 1;
        this.textIndex = this.textIndex + 1;
      } else {
        this.caretIndex = this.caretIndex + 1;
      }
    }
  }

  public removeChip(itemIndex: number): void {
    const textBeforeChip = this.data[this.lineIndex][itemIndex - 1];
    const textAfterChip = this.data[this.lineIndex][itemIndex + 1];
    if (textBeforeChip) {
      textBeforeChip.value = `${textBeforeChip?.value} ${textAfterChip?.value}`;
      this.data[this.lineIndex].splice(itemIndex + 1, 1);
    }
    this.data[this.lineIndex].splice(itemIndex, 1);
    this.getValue();
  }

  public getTextTypeByCaretIndex(caretIndex: number): TextType | undefined {
    let textType: TextType | undefined;
    let totalLength = 0;
    const textArray = this.data[0];

    for (const element of textArray) {
      if (totalLength + element.value.length > caretIndex || (this.getCaretPosition() !== 1 && element.value.length === caretIndex)) {
        textType = element.type;
        break;
      }
      totalLength = totalLength + element.value.length;
    }

    return textType;
  }

  public getTextIndexByCaretIndex(caretIdex: number, textType: TextType): number {
    let textIndex = -1;
    let totalLength = 0;
    const textLengthArray = this.data[0].map((text: {type: TextType; value: string}) => text.value.length);

    for (let i = 0; i < textLengthArray.length; i++) {
      if (totalLength + textLengthArray[i] > caretIdex || (this.getCaretPosition() !== 1 && totalLength + textLengthArray[i] === caretIdex)) {
        textIndex = i;
        break;
      }
      totalLength = totalLength + textLengthArray[i];
    }

    return textType === TextType.TEXT ? textIndex : textIndex + 1;
  }

  public getLengthTillTextIndex(itemIndex: number, textType: TextType): number {
    return this.data[this.lineIndex]
      .slice(0, itemIndex)
      .map((text: {type: string; value: string}) => text.value.length)
      .reduce((previousValue: number, currentValue: number) => previousValue + currentValue, textType === TextType.TEXT ? -1 : 0);
  }

  public setCaretIndex(itemIndex: number, textType: TextType): void {
    this.getValue();
    this.caretIndex = textType === TextType.TEXT ? this.getCaretPosition() + this.getLengthTillTextIndex(itemIndex, textType) : this.getLengthTillTextIndex(itemIndex + 1, textType);

    this.textIndex = this.getTextIndexByCaretIndex(this.caretIndex, textType);
  }

  public getValue(): void {
    this.valueChange.emit(
      this.data
        .map((line: {type: TextType; value: string}[]) => {
          return line
            .map((value: {type: TextType; value: string}) => {
              if (value.type === TextType.TEXT) {
                return value.value;
              } else {
                return `%{${this.getVariableIdByName(value.value)}}%`;
              }
            })
            .join(' ');
        })
        .join('\\n')
    );
  }

  private getVariableIdByName(name: string): number | undefined {
    return this.variableData.find((variable: {id: number; name: string}) => variable.name === name)?.id;
  }

  private getCaretPosition(): number {
    return window.getSelection()!.focusOffset;
  }
}
