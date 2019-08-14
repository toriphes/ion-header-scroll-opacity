import {
  Directive,
  Input,
  Renderer2,
  ContentChild,
  OnInit,
  OnDestroy
} from '@angular/core';
import { IonContent, IonToolbar } from '@ionic/angular';
import { Subscription } from 'rxjs';

/**
 * @description
 *
 * Change the header/toolbar opacity when the ion-content is scrolling
 *
 * ## Usage
 *
 * ```html
 * <ion-header scrollOpacity [ionContentRef]="mycontent">
 *   <ion-toolbar color="primary">
 *     <ion-title>Scroll</ion-title>
 *   </ion-toolbar>
 * </ion-header>
 *
 * <ion-content #mycontent [scrollEvents]="true">
 * </ion-content>
 * ```
 */
@Directive({
  selector: 'ion-header[scrollOpacity]'
})
export class IonHeaderScrollOpacityDirective implements OnInit, OnDestroy {
  /**
   * Reference to ion-content component
   */
  @Input() ionContentRef: IonContent;

  /**
   * Amount of pixel to be scrolled in order end the opacity transition
   */
  @Input() scrollAmount = 88;

  /**
   * If true the header background starts with opacity=0
   */
  @Input() isTransparent = true;

  /**
   * ion-toolbar reference
   */
  // @ts-ignore
  @ContentChild(IonToolbar, { static: true }) toolbar: IonToolbar;

  /**
   * Toolbar background html element
   */
  toolbarEl: HTMLElement;

  /**
   * Element where the scrolling takes place
   */
  scrollArea: HTMLElement;

  /**
   * Scroll subscription ref. When the target component is destroyed we should unsubscribe to avoid memory leak
   */
  private scrollSbuscription: Subscription;

  constructor(private renderer: Renderer2) {}

  async ngOnInit() {
    if (!this.toolbar) {
      throw new Error(
        'IonToolbar component not found for scrollOpacity directive'
      );
    }

    // get the real scroll element
    this.scrollArea = await this.ionContentRef.getScrollElement();

    // listen for ion-content scroll event
    this.scrollSbuscription = this.ionContentRef.ionScroll.subscribe(() => {
      this.changeOpacity();
    });

    this.toolbarEl = (this.toolbar as any).el as HTMLElement;

    // @ts-ignore
    // toolbarEl is a stenciljs web component
    this.toolbarEl.componentOnReady().then(() => {
      this.renderer.setStyle(
        this.toolbarBackgroundEl,
        'opacity',
        this.isTransparent ? 0 : 1
      );
    });
  }

  ngOnDestroy() {
    this.scrollSbuscription.unsubscribe();
  }

  /**
   * Extract the toolbar-background element from the toolbar shadow dom
   */
  get toolbarBackgroundEl() {
    return this.toolbarEl.shadowRoot.children[0];
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

    this.renderer.setStyle(this.toolbarBackgroundEl, 'opacity', amount);
  }
}
