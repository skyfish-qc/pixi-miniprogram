pixijs 小程序 WebGL 的适配版本。

## 使用

可参考 example 目录下的示例项目或参照以下流程：

1. 复制dist目录的pixi.miniprogram.js到目录libs下

2. 导入小程序适配版本的 pixi.js

```javascript
import {createPIXI} from "../../libs/pixi.miniprogram"
var unsafeEval = require("../../libs/unsafeEval")
var installSpine = require("../../libs/pixi-spine")
var installAnimate = require("../../libs/pixi-animate")
var myTween = require("../../libs/myTween")
var PIXI = {};
var app = getApp()
Page({
	onLoad:function () {
		var info = wx.getSystemInfoSync();
		var query = wx.createSelectorQuery();
		var sw = info.screenWidth;//获取屏幕宽高
		var sh = info.screenHeight;//获取屏幕宽高
		var tw = 750;
		var th = parseInt(tw*sh/sw);//计算canvas实际高度
		var stageWidth = tw;
		var stageHeight = th;
		var query2d = wx.createSelectorQuery();
		var query = wx.createSelectorQuery();
		query2d.select('#canvas2d').fields({ node: true, size: true }).exec((res2d) => {
			var canvas2d = res2d[0].node;
			query.select('#myCanvas').fields({ node: true, size: true }).exec((res) => {
				var canvas = res[0].node;
				canvas.width = sw;//设置canvas实际宽高
				canvas.height = sh;//设置canvas实际宽高,从而实现全屏
				PIXI = createPIXI(canvas,stageWidth,canvas2d);//传入canvas，传入canvas宽度，用于计算触摸坐标比例适配触摸位置
				unsafeEval(PIXI);//适配PIXI里面使用的eval函数
				installSpine(PIXI);//注入Spine库
				installAnimate(PIXI);//注入Animate库
				var renderer = PIXI.autoDetectRenderer({width:stageWidth, height:stageHeight,'transparent':false,'view':canvas});//通过view把小程序的canvas传入
				var stage = new PIXI.Container();
				var bg = PIXI.Sprite.from("img/bg.jpg");
				stage.addChild(bg);
				bg.interactive=true;
				bg.on("touchstart",function(e){
					console.log("touchstart",e.data.global)
				});
				bg.on("pointerup",function(e){
					console.log("touchend")
				});
				//小程序不支持加载本地fnt，json文件，所以涉及到fnt，json文件的加载需要放到网络服务器
				PIXI.Loader.shared
					.add("https://raw.githubusercontent.com/skyfish-qc/imgres/master/blog.fnt")
					.add("https://raw.githubusercontent.com/skyfish-qc/imgres/master/mc.json")
					.add('spineboypro', "https://raw.githubusercontent.com/skyfish-qc/imgres/master/spineboy-pro.json").load(function(loader, res){
					var btext = new PIXI.BitmapText('score:1234',{'font':{'name':'blog','size':'60px'},'tint':0xffff00});
					btext.x = 40;
					btext.y = 40;
					stage.addChild(btext);
					var explosionTextures = [];
					for (var i = 0; i < 26; i++) {
						var texture = PIXI.Texture.from('pic'+(i+1)+'.png');
						explosionTextures.push(texture);
					}

					for (i = 0; i < 5; i++) {
						var explosion = new PIXI.AnimatedSprite(explosionTextures);

						explosion.x = Math.random() * stageWidth;
						explosion.y = Math.random() * stageHeight*0.2;
						explosion.anchor.set(0.5);
						explosion.rotation = Math.random() * Math.PI;
						explosion.scale.set(0.75 + Math.random() * 0.5);
						explosion.gotoAndPlay(Math.random() * 27);
						stage.addChild(explosion);
					}
					var spineBoyPro = new PIXI.spine.Spine(res.spineboypro.spineData);
					spineBoyPro.x = stageWidth / 2;
					spineBoyPro.y = 1200;

					spineBoyPro.scale.set(0.5);
					spineBoyPro.state.setAnimation(0, "hoverboard",true);
					stage.addChild(spineBoyPro);
					
					//测试Animate
					var mymc = new PIXI.animate.MovieClip();
					stage.addChild(mymc);

					const graphics = new PIXI.Graphics();
					graphics.beginFill(0xFF3300);
					graphics.drawRect(50, 250, 100, 100);
					graphics.endFill();
					stage.addChild(graphics);
					renderer.render(stage);
				});
				//myTween缓动库使用示例
				/*
				缓动公式：Linear,Quad,Cubic,Quart,Sine,Expo,Circ,Elastic,Back,Bounce,Quint
				比如myTween.Quad.Out,myTween.Quad.In,myTween.Quad.InOut
				onEnd:结束事件
				onUpdate:每帧触发
				myTween.clean();//清除所有事件
				*/
				var tweenObj = PIXI.Sprite.from("img/head.png");
				tweenObj.y = 500;
				stage.addChild(tweenObj);
				var tx = 600;
				function tweenMove() {
					myTween.to(tweenObj,1,{x:tx,ease:myTween.Quad.Out,onEnd:function(){
						if(tx>0) {
							tx = 0;
						} else {
							tx = 600;
						}
						tweenMove();
					}});
				}
				tweenMove();
				function animate() {
					canvas.requestAnimationFrame(animate);
					renderer.render(stage);
					myTween.update();
				}
				animate();
			})
		})
	},
	touchEvent:function(e){
		//接收小程序的触摸事件传给PIXI
		PIXI.dispatchEvent(e);
	}
})
```

## 说明

- 本项目当前使用的 pixi.js 版本号为 5.2.1。
- 该适配版本的 PIXI 不在全局环境中，如使用 pixi.js 的其他配套类库，需要自行传入 PIXI 到类库中。可参考libs里面的pixi-spine的做法。
- 如果需要使用PIXI.Graphics对象，需要在wxml文件中添加一个type 2d的canvas，然后把canvas传入PIXI中，PIXI = createPIXI(canvas,stageWidth,canvas2d);
- 动态canvas不支持，所以文字需要使用bitmapFont。
- 视频不支持
