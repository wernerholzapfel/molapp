import { Component, Input, Output, EventEmitter, ElementRef, QueryList, ContentChildren } from '@angular/core';

export interface CourselItem {
  '_id': string,
  'uid': number,
  'name': string,
  'mol': boolean,
  'laatsteaflevering': number,
  'winnaar': boolean,
  'selected': boolean
}

export interface SlideItem {
  '_id': string,
  'uid': number,
  'name': string,
  'mol': boolean,
  'laatsteaflevering': number,
  'winnaar': boolean,
  'selected': boolean
}


@Component({
  selector: 'carousel',
  template: `
    <div class="carousel-container" *ngIf="items.length > 0">
      <div class="carousel">
        <div radio-group class="carousel-slide-item" [ngClass]="{'inactive' : item.laatsteaflevering}"
        *ngFor="let item of items"
        (click)="(item.laatsteaflevering || selectItem(item))"
        [ngStyle]="{'transform': 'rotateY(-'+item.currentPlacement+'deg)  translateZ('+tz+'px)', '-webkit-transform': 'rotateY('+item.currentPlacement+'deg)  translateZ('+tz+'px)', '-ms-transform': 'rotateY('+item.currentPlacement+'deg)  translateZ('+tz+'px)', 
        '-o-transform': 'rotateY('+item.currentPlacement+'deg)  translateZ('+tz+'px)'}"
        (swipeleft)="onSwipeLeft($event);"
        (swiperight)="onSwipeRight($event);">
          <img class="carousel_image" [ngClass]="{'img_inactive' : item.laatsteaflevering}"  max-height="100%" [src]="'http://wieisdemol.avrotros.nl/typo3conf/ext/widm_resources/Resources/Public/GFX/avatar_' + item.name.toLowerCase() + '.jpg'"/>
        </div>
      </div>
    </div>
  `
})
export class CarouselComponent {
  private currentDeg: number = 0;
  public items: Array<SlideItem> = [];
  private containerWidth: number = 250;
  private tz: number;

  @Input() molid;
  @Input() buttonText;
  @Input() set slides(values: Array<CourselItem>) {
    if (!values.length) return;

    let degree: number = 0 - ((this.molid-1) * 360/values.length);
    console.log("this is the degree: " + degree);
    this.tz = 250;//Math.round((this.containerWidth / 2) /
      //Math.tan(Math.PI / values.length));
    this.items = <Array<SlideItem>>values.map((item: CourselItem, index: number) => {
      let slideItem = {
        idx: index,
        '_id': item._id,
        'uid': item.uid,
        'name': item.name,
        'mol': item.mol,
        'laatsteaflevering': item.laatsteaflevering,
        'winnaar': item.winnaar,
        'selected': item.selected,
        currentPlacement: degree
      };
      console.log("dit is molid: " +this.molid);
      degree = degree + (360/values.length);
      return slideItem;
    })
  }

  @Output() selectSlide = new EventEmitter();

  constructor(private eleRef: ElementRef) {
   }


  onSwipeLeft() {
    this.currentDeg = this.currentDeg - (360/this.items.length);
    this.applyStyle();
  }

  onSwipeRight() {
    this.currentDeg = this.currentDeg + 360/this.items.length;
    this.applyStyle();
  }

  private applyStyle() {
    let ele = this.eleRef.nativeElement.querySelector('.carousel');
    ele.style[ '-webkit-transform' ] = "rotateY(" + this.currentDeg + "deg)";
    ele.style[ '-moz-transform' ] = "rotateY(" + this.currentDeg + "deg)";
    ele.style[ '-o-transform' ] = "rotateY(" + this.currentDeg + "deg)";
    ele.style[ 'transform' ] = "rotateY(" + this.currentDeg + "deg)";
  }

  selectItem(item:any){
    this.selectSlide.emit(item);
  }
}
