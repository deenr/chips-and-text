import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: "app-editable-with-parsing",
  templateUrl: "./editable-with-parsing.component.html",
  styleUrls: ["./editable-with-parsing.component.css"]
})
export class EditableWithParsingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  editableContent: any;
  @ViewChild("editable") editableContentText: ElementRef;

  value = "";
  cursorIndex = 0;

  showAutocomplete = false;
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {}

  // onKeyUp(keyEvent: string) {
  //   // this.editableContent = element;
  //   if (keyEvent === "@") {
  //     this.trigger.openMenu();
  //   }
  //   this.cursorIndex = window.getSelection()!.focusOffset;

  //   // parseIt(this.editableContentText.nativeElement.innerText);
  //   this.value = this.editableContentText.nativeElement.innerText;
  // }

  onKeyUp(keyEvent: string, value: string) {
    if (keyEvent === "@") {
      this.trigger.openMenu();
    }
    this.value = this.editableContentText.nativeElement.innerText;
    console.log(this.value);
    this.cursorIndex = window.getSelection()!.focusOffset;
  }


  onOptionSelect(option: string) {
    console.log(option, this.value);
    this.value =
      this.value.slice(0, this.cursorIndex) +
      option +
      this.value.slice(this.cursorIndex);

    this.editableContentText.nativeElement.innerText = this.value;
    setTimeout(() => {
      let element = document.querySelector("div[contenteditable]") as any;
      let s = window.getSelection();
      let r = document.createRange();
      console.log(s);
      console.log(r);
      console.log(element.firstChild);
      console.log(this.cursorIndex);
      r.setStart(element.firstChild, this.cursorIndex + option.length);
      r.setEnd(element.firstChild, this.cursorIndex + option.length);
      s!.removeAllRanges();
      s!.addRange(r);
    }, 100);
  }

  parseIt(text: string) {
    text;
  }

  setPos(index: number) {
    var el = document.getElementById("editable");
    var range = document.createRange();
    var sel = window.getSelection();

    console.log(range, sel);
    // range.setStart(el!.childNodes[2], 5);
    range.collapse(true);

    sel!.removeAllRanges();
    sel!.addRange(range);
    // this.editableContent.focus();
    // document.getSelection()!.collapse(this.editableContent, index);
  }

  openMenu() {
    this.trigger.openMenu();
  }

  // onOptionSelect(option: string) {
  //   // let tag = document.createElement("span");
  //   // tag.innerText = option;
  //   // tag.classList.add("tag-style");

  //   // this.editableContentHTML.innerHTML =
  //   //   "<span class='tag-style'>[@" + option + "]</span>";

  //   this.editableContentText.nativeElement.innerHTML =
  //     this.value.slice(0, this.cursorIndex) +
  //     option +
  //     this.value.slice(this.cursorIndex);
  //   this.editableContentText.nativeElement.focus();
  // }

  autcompleteData = [
    {
      username: "bkindle",
      name: "Ben Kindle",
      id: "11111"
    },
    {
      username: "cgatian",
      name: "Chaz Gatian",
      id: "22222"
    },
    {
      username: "zream",
      name: "Zack Ream",
      id: "33333"
    },
    {
      username: "jkang",
      name: "Joe Kang",
      id: "44444"
    },
    {
      username: "jpu",
      name: "Juana Pu",
      id: "55555"
    },
    {
      username: "lgatchell",
      name: "Luke Gatchell",
      id: "66666"
    },
    {
      username: "jolewniczak",
      name: "Jerry Olewniczak",
      id: "77777"
    },
    {
      username: "jlutz",
      name: "Jason Lutz",
      id: "88888"
    }
  ];
}
