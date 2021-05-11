#pixijs 小程序 WebGL 的适配版本。
---
  - 2021.1.11 修复graphics在新版微信内不正常显示的bug
  - 2021.1.14 改写PIXI.Text和PIXI.Graphics的渲染逻辑，需要在wxml文件中添加两个type 2d的canvas，然后把canvas传入PIXI中。其中一个用于Graphics渲染，一个用于Text渲染，传入参数示例：PIXI = createPIXI(canvas,stageWidth,canvas2d,canvas2dText)
  - 2021.3.25 添加遮罩实现示例
  - 2021.3.29 添加performance的判断
  - 2021.5.11 修改animate库不能显示的问题
---

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
        var sw = info.screenWidth;//获取屏幕宽高
        var sh = info.screenHeight;//获取屏幕宽高
        var tw = 750;
        var th = parseInt(tw*sh/sw);//计算canvas实际高度
        var stageWidth = tw;
        var stageHeight = th;
        var query = wx.createSelectorQuery();
        query.select('#myCanvas').node().exec((res) => {
            var canvas = res[0].node;
            canvas.width = sw;//设置canvas实际宽高
            canvas.height = sh;//设置canvas实际宽高,从而实现全屏
            var query2d = wx.createSelectorQuery();
            query2d.select('#canvas2d').fields({ node: true, size: true }).exec(function(res2d){
                var canvas2d = res2d[0].node;
                canvas2d.width = 16;
                canvas2d.height = 16;
                var query2dText = wx.createSelectorQuery();
                query2dText.select('#canvas2dText').fields({ node: true, size: true }).exec(function(res2dtext){
                    var canvas2dText = res2dtext[0].node;
                    canvas2dText.width = 16;
                    canvas2dText.height = 16;
                    PIXI = createPIXI(canvas,stageWidth,canvas2d,canvas2dText);//传入canvas，传入canvas宽度，用于计算触摸坐标比例适配触摸位置
                    unsafeEval(PIXI);//适配PIXI里面使用的eval函数
                    installSpine(PIXI);//注入Spine库
                    installAnimate(PIXI);//注入Animate库
                    var renderer = PIXI.autoDetectRenderer({width:stageWidth, height:stageHeight,'transparent':false,premultipliedAlpha:true,'view':canvas});//通过view把小程序的canvas传入
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

                        for (i = 0; i < 2; i++) {
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

                        const testTxt = new PIXI.Text("test",{fill:'#ff0000',fontSize:44});
                        testTxt.x = 100;
                        testTxt.y = 400;
                        stage.addChild(testTxt);

                        const testTxt2 = new PIXI.Text("",{fill:'#ff0000',fontSize:44});
                        testTxt2.x = 100;
                        testTxt2.y = 500;
                        stage.addChild(testTxt2);
                        testTxt2.text = "test2";

                        const graphics = new PIXI.Graphics();
                        graphics.beginFill(0xFF3300);
                        graphics.drawRect(0, 0, 100, 100);
                        graphics.endFill();
                        graphics.x = 100;
                        graphics.y = 200;
                        stage.addChild(graphics);

                        const graphics2 = new PIXI.Graphics();
                        graphics2.beginFill(0xFFFF00);
                        graphics2.drawRect(0, 0, 200, 200);
                        graphics2.endFill();
                        graphics2.x = 200;
                        graphics2.y = 400;
                        stage.addChild(graphics2);

                        //遮罩示例start
                        //遮罩示意shader
                        var frag = `
                        varying vec2 vTextureCoord;
                        uniform vec4 inputPixel;
                        uniform vec2 dimensions;
                        uniform sampler2D uSampler;
                        uniform sampler2D masktex;
                        void main(void) {
                            vec4 color = texture2D(uSampler, vTextureCoord);
                            vec2 coord = vTextureCoord.xy * inputPixel.xy / dimensions.xy;
                            vec4 maskcolor = texture2D(masktex, coord);
                            gl_FragColor = color*maskcolor;
                        }
                        `;
                        const maskshape = new PIXI.Graphics();
                        maskshape.beginFill(0xFFFFFF);//用于遮罩的形状必须为白色，因为shader遮罩原理是目标颜色乘以遮罩形状颜色，设置成白色可以避免干扰目标颜色。
                        maskshape.drawCircle(100, 100, 100);
                        maskshape.endFill();
                        maskshape.x = 200;
                        maskshape.y = 600;
                        stage.addChild(maskshape);//先加入渲染
                        var masktex = renderer.generateTexture(maskshape);//获取到遮罩形状纹理，如果是直接加载外部遮罩图片，上面部分可以省略。
                        stage.removeChild(maskshape);//获得纹理后移除
                        var uniform = {
                            masktex:masktex,
                            dimensions: [200, 200]//传入遮罩纹理图片尺寸，用于计算纹理的实际uv
                        }
                        
                        var shader = new PIXI.Filter(null,frag,uniform);
                        graphics2.filters = [shader];//给graphics2物体进行遮罩，原来是方形的经过遮罩后变成圆形
                        //遮罩示例end

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
                    // renderer.render(stage);
                });
                });
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
- 改写PIXI.Text和PIXI.Graphics的渲染逻辑，需要在wxml文件中添加两个type 2d的canvas，然后把canvas传入PIXI中。其中一个用于Graphics渲染，一个用于Text渲染，传入参数示例：PIXI = createPIXI(canvas,stageWidth,canvas2d,canvas2dText)。
- 视频不支持
