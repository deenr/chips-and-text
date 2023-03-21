import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {TextType} from '../old-elements/text-area-with-chips/text-type.enum';

@Component({
  selector: 'app-editable-div-input',
  templateUrl: './editable-div-input.component.html',
  styleUrls: ['./editable-div-input.component.scss']
})
export class EditableDivInputComponent implements AfterViewInit {
  @ViewChild('editable') public readonly editableDiv: ElementRef;
  public caretIndex: number;
  public value: string;

  public readonly variableData = [
    {id: 0, name: 'Machine name'},
    {id: 1, name: 'Actual temperature'},
    {id: 2, name: 'Actual RPM'}
  ];

  public data: {type: TextType; value: string}[] = [
    {type: TextType.TEXT, value: 'The temperature of'},
    {type: TextType.CHIP, value: 'Machine name'},
    {type: TextType.TEXT, value: 'was'},
    {type: TextType.CHIP, value: 'Actual temperature'},
    {type: TextType.TEXT, value: 'and was too high.'}
  ];

  public ngAfterViewInit(): void {
    this.data.forEach((text: {type: TextType; value: string}) => {
      this.getDivNativeElement().appendChild(text.type === TextType.TEXT ? this.createSpan(text.value) : this.createChipSpan(text.value));
    });
  }

  public onBlur(): void {
    this.getValue();
  }

  private getDivChildrenLength(): number[] {
    return this.getDivChildren().map((child: Element) => {
      return child.innerHTML.split('<button>').length === 2 ? child.innerHTML.split('<button>')[0].length + 1 : child.innerHTML.split('<button>')[0].length;
    });
  }

  public onOptionSelect(option: string) {
    const textLengthArray = this.getDivChildrenLength();

    let textLengthSum = 0;
    for (let index = 0; index < textLengthArray.length; index++) {
      if (textLengthSum + textLengthArray[index] > this.caretIndex || (window.getSelection()?.focusOffset === textLengthArray[index] && textLengthSum + textLengthArray[index] >= this.caretIndex)) {
        const textToSplit = this.getDivChildren()[index].innerHTML;

        const firstPart = textToSplit.slice(0, this.caretIndex - textLengthSum);
        const secondPart = textToSplit.slice(this.caretIndex - textLengthSum, textToSplit.length);
        this.getDivChildren()[index].innerHTML = firstPart;

        if (index === this.getDivChildren().length - 1) {
          this.getDivNativeElement().appendChild(this.createChipSpan(option));
          this.getDivNativeElement().appendChild(this.createSpan(secondPart));
        } else {
          this.getDivNativeElement().insertBefore(this.createSpan(secondPart), this.getDivChildren()[index + 1]);
          this.getDivNativeElement().insertBefore(this.createChipSpan(option), this.getDivChildren()[index + 1]);
        }

        break;
      }
      textLengthSum = textLengthSum + textLengthArray[index];
    }

    this.getValue();
  }

  public getCaretPosition(): void {
    const caretIndex = this.getCaretCharacterOffsetWithin(this.editableDiv.nativeElement);

    const textLengthArray = this.getDivChildrenLength();

    let textLengthSum = 0;
    for (let index = 0; index < textLengthArray.length; index++) {
      if (textLengthSum + textLengthArray[index] > caretIndex || (window.getSelection()?.focusOffset === textLengthArray[index] && textLengthSum + textLengthArray[index] >= caretIndex)) {
        if (this.getDivChildren()[index].classList.contains('chip')) {
          this.caretIndex = textLengthSum + textLengthArray[index];
        } else {
          this.caretIndex = caretIndex;
        }
        break;
      }
      textLengthSum = textLengthSum + textLengthArray[index];
    }
  }

  public getCaretCharacterOffsetWithin(element: Node): any {
    let caretOffset = 0;

    if (window.getSelection) {
      const range = window.getSelection()!.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }

    return caretOffset;
  }

  private getValue(): void {
    this.value = this.getDivChildren()
      .map((child: Element) => {
        if (child.classList.contains('chip')) {
          return `%{${this.getVariableIdByName(child.innerHTML.split('<button>')[0])}}%`;
        }
        return child.innerHTML;
      })
      .join(' ');
  }

  private getVariableIdByName(name: string): number | undefined {
    return this.variableData.find((variable: {id: number; name: string}) => variable.name === name)?.id;
  }

  private getDivChildren(): Element[] {
    return [...this.editableDiv.nativeElement.children];
  }

  private getDivNativeElement(): Element {
    return this.editableDiv.nativeElement;
  }

  private createSpan(name: string): HTMLSpanElement {
    let span = document.createElement('span');
    span.textContent = name;
    return span;
  }

  private createChipSpan(name: string): HTMLSpanElement {
    let span = document.createElement('span');
    span.textContent = name;

    span.classList.add('chip');
    span.contentEditable = 'false';

    let button = document.createElement('button');
    button.textContent = 'X';
    button.addEventListener('click', () => {
      const span = button.parentNode;
      const index = this.getDivChildren().findIndex((child: Element) => child === span);
      this.getDivChildren()[index - 1].innerHTML = `${this.getDivChildren()[index - 1].innerHTML} ${this.getDivChildren()[index + 1].innerHTML}`;
      this.getDivChildren()[index + 1].remove();
      this.getDivChildren()[index].remove();

      this.getValue();
    });
    span.appendChild(button);
    return span;
  }
}
