import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[scroll-to-bottom]'
})

export class ScrollToBottomDirective {
  constructor(private _el: ElementRef) { }

  public scrollToBottom() {
    const el: HTMLDivElement = this._el.nativeElement;
    //console.log(this._el.nativeElement)
    console.log("S C R O L L E D");
    el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
  }

}