[![npm](https://img.shields.io/npm/l/ion-header-scroll-opacity.svg)](https://www.npmjs.com/package/ion-header-scroll-opacity/)
[![npm](https://img.shields.io/npm/dt/ion-header-scroll-opacity.svg)](https://www.npmjs.com/package/ion-header-scroll-opacity)
[![npm](https://img.shields.io/npm/dm/ion-header-scroll-opacity.svg)](https://www.npmjs.com/package/ion-header-scroll-opacity)

# ion-header-scroll-opacity

Change header background opacity on content scroll.

## install

```bash
npm i ion-header-scroll-opacity --save
```

## Import directive

Import the `IonHeaderScrollOpacityModule` into the your `app.module.ts`.

```typescript
import { IonHeaderScrollOpacityModule } from 'ion-header-scroll-opacity';

@NgModule({
  declarations: [MyApp, IonHeaderScrollOpacityModule, HomePage],
  imports: [BrowserModule, IonicModule.forRoot(MyApp), HttpModule],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
```

## Usage

Put the `header-scroll-opacity` directive on the ion-header element.

### Directive Input

| Input         | Description                                                        | Default value |
| ------------- | ------------------------------------------------------------------ | ------------- |
| scrollArea    | `ion-content` reference                                            | _none_        |
| scrollAmount  | Amount of pixel to be scrolled in order end the opacity transition | 88            |
| isTransparent | If true the header background starts with opacity=0                | true          |

```html
<ion-header header-scroll-opacity [scrollArea]="mycontent">
  <ion-navbar color="primary">
    <ion-title>
      Do scroll
    </ion-title>
  </ion-navbar>
</ion-header>

<ion-content no-padding #mycontent fullscreen>
  ...long scrolling content...
</ion-content>
```

### Tip

Add the `fullscreen` attribute to the `ion-content` element and add some css style to make a good effect

```css
.scroll-content {
  padding-top: 0px !important;
}
```

## Demo

![Demo](./ion-header-scroll-opacity.gif 'Demo')

## Contribute

Any pull-request and issues are wellcome
