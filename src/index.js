import {atob as _atob} from 'abab';
import XMLHttpRequest from './XMLHttpRequest'
import window from './window'
var DOMParser=require("./xmldom").DOMParser;
import TouchEvent from "./touchEvent"
import Audio from './Audio'

export function createPIXI(canvas,stageWidth) {
	let ratio = stageWidth/canvas.width;
	let evtArr = {};
	canvas.style = {width: canvas.width + 'px', height: canvas.height + 'px'}
	canvas.parentElement=true;
	canvas.getBoundingClientRect=function(){
		return { left: 0, top: 0, width:canvas.width, height:canvas.height };
	};
	canvas.addEventListener = function(eventName,eventFun){
		window.addEventListener(eventName,eventFun);
	}
	canvas.removeEventListener = function(eventName,eventFun) {
		window.removeEventListener(eventName,eventFun);
	}
	// if(typeof canvas.getContext2!='function') {
	// 	canvas.getContext2 = canvas.getContext;
	// 	canvas.getContext = function(t,r){
	// 		var ctx = null;
	// 		ctx = canvas.getContext2('webgl',r);
	// 		console.log(22,r)
	// 		ctx.fillRect=function(){}
	// 		ctx.fillStyle='';
	// 		ctx.drawImage=function(){}
	// 		ctx.getImageData=function(){}
	// 		return ctx;
	// 	}
	// }
	var performance = performance || wx.getPerformance();
	const requestAnimationFrame = canvas.requestAnimationFrame;
	const HTMLVideoElement = function(){};
	const HTMLCanvasElement = function(){};
	const HTMLImageElement = function(){};
	const MouseEvent = function(){};
	const navigator={
		userAgent:"",
        isCocoonJS:true
	};
	const Image = function(){
		let img= canvas.createImage();
		img.crossOrigin="";
		return img;
	}
	const document = {
		createElementNS(_, type) {
			let cvs;
			switch(type) {
				case "canvas":
					cvs = wx.createOffscreenCanvas({type: 'webgl', width: 1, height: 1});
                    cvs.style = {width: '1px', height: '1px'}
                    cvs.addEventListener = function () {}
                    cvs.removeEventListener = function () {}
                    return cvs;
					break;
				case "canvas2d":
					cvs = wx.createOffscreenCanvas({type: '2d', width: 1, height: 1});
                    cvs.style = {width: '1px', height: '1px'}
                    cvs.addEventListener = function () {}
                    cvs.removeEventListener = function () {}
                    return cvs;
					break;
				case "canvas2dText":
					cvs = wx.createOffscreenCanvas({type: '2d', width: 1, height: 1});
                    cvs.style = {width: '1px', height: '1px'}
                    cvs.addEventListener = function () {}
                    cvs.removeEventListener = function () {}
                    return cvs;
					break;
				case "img":
				case "image":
					let img= canvas.createImage();
					img.crossOrigin="";
					return img;
					break;
                case "audio":
                    let audio= new Audio();
                    return audio;
                    break;
				case "div":
					return {style:{}}
					break;
			}
		},
		createElement(type) {
			let cvs;
			switch(type) {
				case "canvas":
					cvs = wx.createOffscreenCanvas({type: 'webgl', width: 1, height: 1});
                    cvs.style = {width: '1px', height: '1px'}
                    cvs.addEventListener = function () {}
                    cvs.removeEventListener = function () {}
                    return cvs;
					break;
				case "canvas2d":
					cvs = wx.createOffscreenCanvas({type: '2d', width: 1, height: 1});
                    cvs.style = {width: '1px', height: '1px'}
                    cvs.addEventListener = function () {}
                    cvs.removeEventListener = function () {}
                    return cvs;
					break;
				case "canvas2dText":
					cvs = wx.createOffscreenCanvas({type: '2d', width: 1, height: 1});
                    cvs.style = {width: '1px', height: '1px'}
                    cvs.addEventListener = function () {}
                    cvs.removeEventListener = function () {}
                    return cvs;
					break;
				case "img":
				case "image":
					let img= canvas.createImage();
					img.crossOrigin="";
					return img;
					break;
				case "audio":
					let audio= new Audio();
					return audio;
					break;
				case "a":
					return {href:""}
					break;
				case "div":
					return {style:{}}
					break;
			}
		},
		addEventListener:function(){},
		removeEventListener:function(){},
	};
	window.document = document;
	// eslint-disable-next-line
	const atob = (a) => {
		return _atob(a)
	}
	__INJECT_PIXI__
	PIXI.utils.skipHello();
	PIXI.dispatchEvent = function(event){
		const touchEvent = new TouchEvent(event.type)
		for(var i=0;i<event.touches.length;i++) {
			event.touches[i].clientX = event.touches[i].x*ratio;
			event.touches[i].clientY = event.touches[i].y*ratio;
			event.touches[i].layerX = event.touches[i].x*ratio;
			event.touches[i].layerY = event.touches[i].y*ratio;
		}
		for(var i=0;i<event.changedTouches.length;i++) {
			event.changedTouches[i].clientX = event.changedTouches[i].x*ratio;
			event.changedTouches[i].clientY = event.changedTouches[i].y*ratio;
			event.changedTouches[i].layerX = event.changedTouches[i].x*ratio;
			event.changedTouches[i].layerY = event.changedTouches[i].y*ratio;
		}
		touchEvent.target = canvas
		touchEvent.touches = event.touches
		touchEvent.targetTouches = Array.prototype.slice.call(event.touches)
		touchEvent.changedTouches = event.changedTouches
		touchEvent.timeStamp = event.timeStamp
		window.dispatchEvent(touchEvent)
	}
	return PIXI
}