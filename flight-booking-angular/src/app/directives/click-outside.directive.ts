import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any): void {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    console.log('Click outside directive - clicked inside:', clickedInside);
    if (!clickedInside) {
      console.log('Emitting click outside event');
      this.clickOutside.emit();
    }
  }
}