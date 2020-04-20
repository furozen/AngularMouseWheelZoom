import {AfterViewInit, Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import {ZoomService} from '../zoom.service';
import { DOCUMENT } from "@angular/common";

@Component({
  selector:'app-desk',
  templateUrl:'./desk.component.html',
  styleUrls:['./desk.component.scss']
})
export class DeskComponent implements AfterViewInit {

  @ViewChild('backgroundSVG', {static:false}) backgroundSVG:ElementRef;
  @ViewChild('section', {static:false}) sectionElRef:ElementRef;
  private width:number;
  private height:number;

  constructor(
    private renderer:Renderer2,
    private zoomService:ZoomService,
    @Inject(DOCUMENT) private document: Document,
  ) {
  }

  ngAfterViewInit() {
    let el = this.sectionElRef.nativeElement as HTMLElement;
    let bounding = el.getBoundingClientRect();

    setTimeout(() => {
      this.width = bounding.width;
      this.height = bounding.height;
      this.drawLines();
      this.zoomService.init(this.renderer, this.sectionElRef, document.getElementById('deskArea'))

    },0);
  }

  private drawLines() {
    const svg = this.backgroundSVG.nativeElement as HTMLElement;
    while (svg.lastChild) {
      svg.removeChild(svg.lastChild);
    }
    //setTimeout(()=> {
      this._drawlines(svg);
    //});

  }

  private _drawlines(svg:HTMLElement) {
    const step = 20;
    let y = step;
   console.log('this.width:',this.width,' this.height:', this.height);
    while (this.height > y) {
      const el = this.renderer.createElement('line', 'svg');
      this.renderer.setAttribute(el, 'x1', '0');
      this.renderer.setAttribute(el, 'x2', `${this.height}`);
      this.renderer.setAttribute(el, 'y1', `${y}`);
      this.renderer.setAttribute(el, 'y2', `${y}`);
      this.renderer.appendChild(svg, el);
      y += step;
    }

    let x = step;
    while (this.width > x) {
      const el = this.renderer.createElement('line', 'svg');
      this.renderer.setAttribute(el, 'y1', '0');
      this.renderer.setAttribute(el, 'y2', `${this.width}`);
      this.renderer.setAttribute(el, 'x1', `${x}`);
      this.renderer.setAttribute(el, 'x2', `${x}`);
      this.renderer.appendChild(svg, el);
      x += step;
    }

    [{x:'0',y:'0'},{x:'0',y:'400'},{x:'400',y:'0'},{x:'400',y:'400'},{x:'200',y:'200'}].forEach((p)=>{
      const el = this.renderer.createElement('rect', 'svg');
      this.renderer.setAttribute(el, 'x', p.x);
      this.renderer.setAttribute(el, 'y', p.y);
      this.renderer.setAttribute(el, 'width', `100`);
      this.renderer.setAttribute(el, 'height', `100`);
      this.renderer.appendChild(svg, el);
    })

  }

}
