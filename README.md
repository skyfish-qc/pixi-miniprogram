pixijs 小程序 WebGL 的适配版本。

## 使用

可参考 example 目录下的示例项目或参照以下流程：

1. 复制dist目录的pixi.miniprogram.js到目录libs下

2. 导入小程序适配版本的 pixi.js

```javascript
import {createPIXI} from "../../libs/pixi.miniprogram"
var unsafeEval = require("../../libs/unsafeEval")
var installSpine = require("../../libs/pixi-spine")
var PIXI = {};
var app = getApp()
Page({
	onLoad:function () {
		var query = wx.createSelectorQuery()
		query.select('#myCanvas').node().exec((res) => {
			var stageWidth = 750;//canvas宽度，跟小程序wxss指定的一样大小
			var stageHeight = 1220;//canvas高度，跟小程序wxss指定的一样大小
			var canvas = res[0].node;
			PIXI = createPIXI(canvas,stageWidth);//传入canvas，传入canvas宽度，用于计算触摸坐标比例适配触摸位置
			unsafeEval(PIXI);//适配PIXI里面使用的eval函数
			installSpine(PIXI);//注入Spine库
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

				for (i = 0; i < 50; i++) {
					var explosion = new PIXI.AnimatedSprite(explosionTextures);

					explosion.x = Math.random() * stageWidth;
					explosion.y = Math.random() * stageHeight;
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
			});
			function animate() {
				canvas.requestAnimationFrame(animate);
				renderer.render(stage);
			}
			animate();
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
