import { Directive, Input } from "@angular/core";

@Directive({
  selector: "[appElementTextContent]"
})
export class ElementTextContentDirective {
  @Input() appElementTextContent = "";

  constructor() {}
}
