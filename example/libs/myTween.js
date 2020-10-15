var myTween = {};
function tween() {
	this.obj = null;
	this.duration = 0;
	this.vars = {};
	this.curTime = 0;
	this.startTime = 0;
	this.endTime = 0;
	this.onplay=false;
	this.ease = myTween.Linear.None;
	this.startVars = {};
}
tween.prototype.init = function(obj,duration,vars){
	this.obj = obj;
	this.duration = duration*1000;
	this.vars = vars;
	this.curTime = 0;
	this.startTime = 0;
	this.endTime = 0;
	this.onplay=false;
	this.ease = vars.ease||myTween.Linear.None;
	this.startVars = {};
	for(var v in this.vars) {
		if(typeof this.obj[v]!="undefined") {
			this.startVars[v] = this.obj[v];
		}
	}
};
tween.prototype.update = function(){
	if(!this.onplay) {
		this.startTime = +new Date;
		this.endTime = this.startTime+this.duration;
		this.curTime = this.startTime;
		this.onplay=true;
	} else {
		this.curTime = +new Date;
	}
	var _elapsed = Math.min(1, Math.max(0, (this.curTime >= this.endTime ? this.duration : (this.curTime - this.startTime)) / this.duration));
	var _radio = this.ease(_elapsed);
	for(var v in this.vars) {
		if(typeof this.obj[v]!="undefined") {
			this.obj[v] = this.startVars[v] + (this.vars[v] - this.startVars[v]) * _radio;
		}
	}
	if(typeof this.vars.onUpdate=='function') {
		this.vars.onUpdate(this.obj);
	}
	var isdel=false;
	if(_elapsed==1) {
		this.onplay=false;
		if(typeof this.vars.onEnd=='function') {
			try{
				this.vars.onEnd(this);
			} catch(e){}
		}
		var idx = updateList.indexOf(this);
		if(idx>=0) {
			tweenTmp.push(updateList[idx]);
			updateList.splice(idx,1);
			isdel=true;
		}
	}
	return isdel;
};
var updateList=[];
var tweenTmp = [];
Object.assign(myTween, {
	to:function(obj,duration,vars){
		var one;
		if(tweenTmp.length>0) {
			one = tweenTmp.pop();
		} else {
			one = new tween();
		}
		one.init(obj,duration,vars);
		updateList.push(one);
	},
	update:function(){
		var len = updateList.length;
		for(var i=0;i<len;i++) {
			if(updateList[i].update()) {
				i--;
				len--;
			}
		}
	},
	clean:function(){
		var len = updateList.length;
		for(var i=0;i<len;i++) {
			tweenTmp.push(updateList[i]);
		}
		updateList=[];
	}
});
Object.assign(myTween, {
	Linear: {
		None: function (k) {
			return k;
		}
	},
	Quad: {
		In: function (k) {
			return k * k;
		},
		Out: function (k) {
			return k * (2 - k);
		},
		InOut: function (k) {
			if ((k *= 2) < 1) return 0.5 * k * k;
			return -0.5 * (--k * (k - 2) - 1);
		}
	},
	Cubic: {
		In: function (k) {
			return k * k * k;
		},
		Out: function (k) {
			return --k * k * k + 1;
		},
		InOut: function (k) {
			if ((k *= 2) < 1) return 0.5 * k * k * k;
			return 0.5 * ((k -= 2) * k * k + 2);
		}
	},
	Quart: {
		In: function (k) {
			return k * k * k * k;
		},
		Out: function (k) {
			return 1 - (--k * k * k * k);
		},
		InOut: function (k) {
			if ((k *= 2) < 1) return 0.5 * k * k * k * k;
			return -0.5 * ((k -= 2) * k * k * k - 2);
		}
	},
	Quint: {
		In: function (k) {
			return k * k * k * k * k;
		},
		Out: function (k) {
			return --k * k * k * k * k + 1;
		},
		InOut: function (k) {
			if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
			return 0.5 * ((k -= 2) * k * k * k * k + 2);
		}
	},
	Sine: {
		In: function (k) {
			return 1 - Math.cos(k * Math.PI / 2);
		},
		Out: function (k) {
			return Math.sin(k * Math.PI / 2);
		},
		InOut: function (k) {
			return 0.5 * (1 - Math.cos(Math.PI * k));
		}
	},
	Expo: {
		In: function (k) {
			return k === 0 ? 0 : Math.pow(1024, k - 1);
		},
		Out: function (k) {
			return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
		},
		InOut: function (k) {
			if (k === 0) return 0;
			if (k === 1) return 1;
			if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
			return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
		}
	},
	Circ: {
		In: function (k) {
			return 1 - Math.sqrt(1 - k * k);
		},
		Out: function (k) {
			return Math.sqrt(1 - (--k * k));
		},
		InOut: function (k) {
			if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
		}
	},
	Elastic: {
		In: function (k) {
			var s, a = 0.1, p = 0.4;
			if (k === 0) return 0;
			if (k === 1) return 1;
			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else s = p * Math.asin(1 / a) / (2 * Math.PI);
			return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
		},
		Out: function (k) {
			var s, a = 0.1, p = 0.4;
			if (k === 0) return 0;
			if (k === 1) return 1;
			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else s = p * Math.asin(1 / a) / (2 * Math.PI);
			return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
		},
		InOut: function (k) {
			var s, a = 0.1, p = 0.4;
			if (k === 0) return 0;
			if (k === 1) return 1;
			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else s = p * Math.asin(1 / a) / (2 * Math.PI);
			if ((k *= 2) < 1) return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
			return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
		}
	},
	Back: {
		In: function (k) {
			var s = 1.70158;
			return k * k * ((s + 1) * k - s);
		},
		Out: function (k) {
			var s = 1.70158;
			return --k * k * ((s + 1) * k + s) + 1;
		},
		InOut: function (k) {
			var s = 1.70158 * 1.525;
			if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
		}
	},
	Bounce: {
		In: function (k) {
			return 1 - JT.Bounce.Out(1 - k);
		},
		Out: function (k) {
			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}
		},
		InOut: function (k) {
			if (k < 0.5) return JT.Bounce.In(k * 2) * 0.5;
			return JT.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
		}
	}
});
module.exports = myTween;