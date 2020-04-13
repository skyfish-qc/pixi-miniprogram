
export default {
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
			case "img":
			case "image":
				cvs = wx.createOffscreenCanvas();
				return cvs.createImage();
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
			case "img":
			case "image":
				cvs = wx.createOffscreenCanvas();
				return cvs.createImage();
				break;
			case "a":
				return {href:""}
				break;
		}
    },
	addEventListener:function(){},
	removeEventListener:function(){},
}
