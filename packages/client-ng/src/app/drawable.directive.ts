/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Directive, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Directive({
    selector: '[appDrawable]',
})
export class DrawableDirective implements OnInit {
    pos = { x: 0, y: 0 };
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    @Output() newImage = new EventEmitter();

    constructor(private el: ElementRef) { }

    ngOnInit() {
        this.canvas = this.el.nativeElement as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
    }

    @HostListener('mouseup', ['$event'])
    onUp(e) {
        this.newImage.emit(this.getImgData());
    }

    @HostListener('mouseenter', ['$event'])
    onEnter(e) {
        this.setPosition(e);
    }

    @HostListener('mousedown', ['$event'])
    onMove(e) {
        this.setPosition(e);
    }

    @HostListener('mousemove', ['$event'])
    onDown(e) {

        if (e.buttons !== 1) {
            return;
        }

        this.ctx.beginPath(); // begin

        this.ctx.lineWidth = 10;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = '#111111';

        this.ctx.moveTo(this.pos.x, this.pos.y);
        this.setPosition(e);
        this.ctx.lineTo(this.pos.x, this.pos.y);

        this.ctx.stroke();
    }

    @HostListener('resize', ['$event'])
    onResize(e) {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
    }

    setPosition(e) {
        this.pos.x = e.offsetX;
        this.pos.y = e.offsetY;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    getImgData(): ImageData {
        return this.ctx.getImageData(0, 0, 300, 300);
    }
}
