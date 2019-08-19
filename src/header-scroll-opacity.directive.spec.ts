import {
  Component,
  ViewChild,
  ContentChild,
  DebugElement
} from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  fakeAsync,
  async,
  TestBed,
  tick
} from '@angular/core/testing';

import { IonHeaderScrollOpacityDirective } from './header-scroll-opacity.directive';
import { IonicModule, IonToolbar, IonContent } from '@ionic/angular';
import { IonHeaderScrollOpacityModule } from './header-scroll-opacity.module';

enum TemplateCase {
  NON_ION_HEADER,
  NON_VALID_ION_CONTENT,
  DEFAULT
}

@Component({
  selector: 'test-component',
  template: ''
})
class TestComponent {
  @ViewChild(IonContent, { static: true }) content: IonContent;

  ngOnInit() {}
}

const createComponent = (temp: TemplateCase = TemplateCase.DEFAULT) => {
  let template = '';

  switch (temp) {
    case TemplateCase.NON_ION_HEADER:
      template = `<div scrollOpacity [ionContentRef]="content"><ion-toolbar>
        <ion-title>Test component</ion-title>
      </ion-toolbar>
    </div>
    <ion-content #myContent [scrollEvents]="true"> </ion-content>`;
      break;
    case TemplateCase.NON_VALID_ION_CONTENT:
      template = `<ion-header scrollOpacity [ionContentRef]="mycontent"><ion-toolbar>
        <ion-title>Test component</ion-title>
      </ion-toolbar>
    </ion-header>
    <div #myContent [scrollEvents]="true"> </div>`;
      break;
    default:
      template = `<ion-header scrollOpacity [ionContentRef]="content"><ion-toolbar>
        <ion-title>Test component</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content #myContent [scrollEvents]="true"> </ion-content>`;
  }

  TestBed.overrideComponent(TestComponent, { set: { template } });

  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();

  return fixture;
};

const getDirective = (fixture: ComponentFixture<TestComponent>) => {
  return fixture.debugElement
    .query(By.directive(IonHeaderScrollOpacityDirective))
    .injector.get<IonHeaderScrollOpacityDirective>(
      IonHeaderScrollOpacityDirective
    );
};

describe('Directive header-scroll-opacity', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [IonicModule.forRoot(), IonHeaderScrollOpacityModule]
    }).compileComponents();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
      fixture = null;
    }
  });

  it('should be defined on the test component', () => {
    fixture = createComponent();
    expect(getDirective(fixture)).not.toBeNull();
  });

  it('should throw an error on non ion-header component', () => {
    expect(
      () => (fixture = createComponent(TemplateCase.NON_ION_HEADER))
    ).toThrowError();
  });

  it('should create component', () => {
    fixture = createComponent();
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });

  it('should throw an error if ionContentRef is not a valid ion-content component', () => {
    expect(
      () => (fixture = createComponent(TemplateCase.NON_VALID_ION_CONTENT))
    ).toThrowError();
  });
});
