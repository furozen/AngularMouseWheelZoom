import {ElementRef, Injectable, Renderer2} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ZoomService {


  constructor() { }
  private renderer:Renderer2;
  private scale:number = 1;
  private svgSectionElRef;
  private wheelEl;


  init(renderer:Renderer2, svgSectionElRef:ElementRef,  wheelEl:HTMLElement){
    this.renderer = renderer;
    this.svgSectionElRef = svgSectionElRef;
    this.wheelEl = wheelEl;
    this.setMouseAndTouchEvents();
  }

  private get nativeElement():HTMLElement{
    return this.svgSectionElRef.nativeElement;
  }
  private getTransformStyle() {
    let style = getComputedStyle(this.nativeElement);
    let transform = style.transform;
    let match: any = transform.match(/matrix\(([\d.]+),\s?([\d.]+),\s?([\d.]+),\s?([\d.]+),\s?([\d.]+),\s?([\d.]+)\)/i);

    if (!(match && match.length)) {
      match = [0, 1, 0, 0, 1, 0, 0];
    }
    return match;
  }

  private setMouseAndTouchEvents() {

    //mousewheel

    this.renderer.listen(this.wheelEl, 'mousewheel', this.mousewheelHandler)

  }


  private mousewheelHandler = (ev:MouseEvent) => {

    //Notice ev.target is #deskArea
    // but I need zoom for #desk
    if(ev.ctrlKey){
      let  zoomFactor = 1;
      if( ev['deltaY']>0){
        zoomFactor = 0.9;
      } if( ev['deltaY']<0){
        zoomFactor = 1.1;
      }
      let b = this.nativeElement.getBoundingClientRect();
      this.calcScale(zoomFactor);

      const mouseX = ev.pageX * this.scale - b.left * this.scale;
      const mouseY = ev.pageY * this.scale - b.top * this.scale;
      this.renderer.setStyle(this.nativeElement, 'transform', `scale(${this.scale})`);
      this.renderer.setStyle(this.nativeElement, 'transform-origin', `${mouseX}px ${mouseY}px`);


    }

  };


  setScale(scaleFactor:number, newScale?:number){
    let scale = this.calcScale( scaleFactor, newScale);
    this.renderer.setStyle(this.nativeElement, 'transform', `scale(${scale})`);

  }

  private calcScale( scaleFactor: number, newScale?: number,) {
    let match = this.getTransformStyle();
    let scale = newScale;
    if (scale === undefined) {
      let currentScale = match ? match[1] : 1;
      scale = currentScale * scaleFactor;
      scale = Math.round(scale * 10) / 10;
    }
    this.scale = scale;
    return scale;
  }

}
