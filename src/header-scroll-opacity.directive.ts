import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  ContentChild
} from '@angular/core';
import { Content, Navbar, Toolbar } from 'ionic-angular';

/**
 * @description
 *
 * Change the header/toolbar opacity when the ion-content is scrolling
 *
 * ## Usage
 *
 * ```html
 * <ion-header header-scroll-opacity [scrollArea]="mycontent">
 *   <ion-navbar color="primary">
 *     <ion-title>Scroll</ion-title>
 *   </ion-navbar>
 * </ion-header>
 *
 * <ion-content [scrollArea]="mycontent">
 * </ion-content>
 * ```
 */
@Directive({
  selector: '[header-scroll-opacity]'
})
export class IonHeaderScrollOpacityDirective {
  /**
   * Reference to ion-content component
   */
  @Input('scrollArea') scrollArea: Content;

  /**
   * Amount of pixel to be scrolled in order end the opacity transition
   */
  @Input('scrollAmount') scrollAmount: number = 88;

  /**
   * If true the header background starts with opacity=0
   */
  @Input('isTransparent') isTransparent: boolean = true;

  /**
   * ion-navbar reference
   */
  @ContentChild(Navbar) navbar: Navbar;

  /**
   * ion-toolbar reference
   */
  @ContentChild(Toolbar) toolbar: Toolbar;

  /**
   * Toolbar background html element
   */
  toolbarEl: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterContentInit() {
    // ion-header may contains a ion-navbar or ion-toolbar component
    const toolbar = this.navbar || this.toolbar;

    if (!toolbar) {
      throw new Error(
        'Neither toolbar or navbar found for header-scoll-opacity directive'
      );
    }

    // listen for ion-content scroll event
    this.scrollArea.ionScroll.subscribe(() => {
      this.changeOpacity();
    });

    this.toolbarEl = (toolbar.getElementRef().nativeElement as HTMLElement)
      .firstChild as HTMLElement;

    // initial toolbar-background opacity wont set without this hack
    let origDidEnter = toolbar.constructor.prototype.didEnter;
    toolbar.constructor.prototype.didEnter = () => {
      this.renderer.setStyle(
        this.toolbarEl,
        'opacity',
        this.isTransparent ? 0 : 1
      );
      origDidEnter.apply(toolbar);
    };
  }

  changeOpacity() {
    let amount =
      ((this.isTransparent ? 1 : 2) -
        (this.scrollArea.scrollTop + this.scrollAmount) / this.scrollAmount) *
      (this.isTransparent ? -1 : 1);

    if (amount > 1) {
      amount = 1;
    }

    if (amount < 0) {
      amount = 0;
    }

    this.renderer.setStyle(this.toolbarEl, 'opacity', amount);
  }
}
