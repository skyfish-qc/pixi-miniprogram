import {atob as _atob} from 'abab';
import XMLHttpRequest from './XMLHttpRequest'
import window from './window'
var DOMParser=require("./xmldom").DOMParser;
import TouchEvent from "./touchEvent"

export function createPIXI(canvas,stageWidth,canvas2d,canvas2dText) {
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
	if(typeof canvas.getContext2!='function') {
		canvas.getContext2 = canvas.getContext;
		canvas.getContext = function(t){
			var ctx = null;
			ctx = canvas.getContext2('webgl');
			ctx.fillRect=function(){}
			ctx.fillStyle='';
			ctx.drawImage=function(){}
			ctx.getImageData=function(){}
			return ctx;
		}
	}
	if(canvas2d) {
		canvas2d.style = {width: canvas2d.width + 'px', height: canvas2d.height + 'px'}
		canvas2d.addEventListener = function () {}
		canvas2d.removeEventListener = function () {}
	}
	if(canvas2dText) {
		canvas2dText.style = {width: canvas2dText.width + 'px', height: canvas2dText.height + 'px'}
		canvas2dText.addEventListener = function () {}
		canvas2dText.removeEventListener = function () {}
	}
	var performance = performance || wx.getPerformance();
	const requestAnimationFrame = canvas.requestAnimationFrame;
	const HTMLVideoElement = function(){};
	const HTMLCanvasElement = function(){};
	const HTMLImageElement = function(){};
	const MouseEvent = function(){};
	const navigator={
		userAgent:""
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
					cvs = wx.createOffscreenCanvas();
					cvs.style = {width: cvs.width + 'px', height: cvs.height + 'px'}
					cvs.addEventListener = function () {}
					cvs.removeEventListener = function () {}
					cvs.getContext2 = cvs.getContext;
					cvs.getContext = function(t){
						var ctx = cvs.getContext2('webgl');
						ctx.fillRect=function(){}
						ctx.fillStyle='';
						ctx.drawImage=function(){}
						ctx.getImageData=function(){}
						return ctx;
					}
					return cvs;
					break;
				case "canvas2d":
					if(canvas2d) {
						return canvas2d;
					} else {
						cvs = wx.createOffscreenCanvas();
						cvs.style = {width: cvs.width + 'px', height: cvs.height + 'px'}
						cvs.addEventListener = function () {}
						cvs.removeEventListener = function () {}
						cvs.getContext2 = cvs.getContext;
						cvs.getContext = function(t){
							var ctx = cvs.getContext2('webgl');
							ctx.fillRect=function(){}
							ctx.fillStyle='';
							ctx.drawImage=function(){}
							ctx.getImageData=function(){}
							return ctx;
						}
						return cvs;
					}
					break;
				case "canvas2dText":
					if(canvas2dText) {
						return canvas2dText;
					} else {
						cvs = wx.createOffscreenCanvas();
						cvs.style = {width: cvs.width + 'px', height: cvs.height + 'px'}
						cvs.addEventListener = function () {}
						cvs.removeEventListener = function () {}
						cvs.getContext2 = cvs.getContext;
						cvs.getContext = function(t){
							var ctx = cvs.getContext2('webgl');
							ctx.fillRect=function(){}
							ctx.fillStyle='';
							ctx.drawImage=function(){}
							ctx.getImageData=function(){}
							return ctx;
						}
						return cvs;
					}
					break;
				case "img":
				case "image":
					let img= canvas.createImage();
					img.crossOrigin="";
					return img;
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
					cvs = wx.createOffscreenCanvas();
					cvs.style = {width: cvs.width + 'px', height: cvs.height + 'px'}
					cvs.addEventListener = function () {}
					cvs.removeEventListener = function () {}
					cvs.getContext2 = cvs.getContext;
					cvs.getContext = function(t){
						var ctx = cvs.getContext2('webgl');
						ctx.fillRect=function(){}
						ctx.fillStyle='';
						ctx.drawImage=function(){}
						ctx.getImageData=function(){}
						return ctx;
					}
					return cvs;
					break;
				case "canvas2d":
					if(canvas2d) {
						return canvas2d;
					} else {
						cvs = wx.createOffscreenCanvas();
						cvs.style = {width: cvs.width + 'px', height: cvs.height + 'px'}
						cvs.addEventListener = function () {}
						cvs.removeEventListener = function () {}
						cvs.getContext2 = cvs.getContext;
						cvs.getContext = function(t){
							var ctx = cvs.getContext2('webgl');
							ctx.fillRect=function(){}
							ctx.fillStyle='';
							ctx.drawImage=function(){}
							ctx.getImageData=function(){}
							return ctx;
						}
						return cvs;
					}
					break;
				case "canvas2dText":
					if(canvas2dText) {
						return canvas2dText;
					} else {
						cvs = wx.createOffscreenCanvas();
						cvs.style = {width: cvs.width + 'px', height: cvs.height + 'px'}
						cvs.addEventListener = function () {}
						cvs.removeEventListener = function () {}
						cvs.getContext2 = cvs.getContext;
						cvs.getContext = function(t){
							var ctx = cvs.getContext2('webgl');
							ctx.fillRect=function(){}
							ctx.fillStyle='';
							ctx.drawImage=function(){}
							ctx.getImageData=function(){}
							return ctx;
						}
						return cvs;
					}
					break;
				case "img":
				case "image":
					let img= canvas.createImage();
					img.crossOrigin="";
					return img;
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
	window.WebGLRenderingContext = canvas.getContext2('webgl');
	const WebGLRenderingContext = window.WebGLRenderingContext;
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