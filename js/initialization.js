paper.install(window);
// Keep global references to both tools, so the HTML
// links below can access them.
//paperScope.install(scope);

window.onload = function() {

    //01 创建画布
    paper.setup('myCanvas'); //01 

    //02 创建我的鼠标事件,myMouseEvent 必须是全局变量
    myMouseEvent = new Tool(); //02 

    //绘制界面
    {
        let UI = new Path.Rectangle(0, 0, 1150, 900);
        UI.strokeColor = 'black';
        UI.fillColor = 'grey';
    }

    //声明变量
    {
        saveSVG = new saveSVG();
        var myPanel = new panel();
        var dvdCurve = new shapeBoard(50, 20, 800, 800); //声明一个变量
        var sketchWindow = new shapeBoard(880, 20, 250, 400); //声明一个变量
        dvdCurve.shapeGroup.updateBoundsAndPosition();
        //console.log(dvdCurve.shapeGroup);

    }

    //图层操作
    {
        //console.log(project.layers);

        //var secondPath = new Path.Circle(new Point(1000, 550), 65);
        //secondPath.fillColor = 'green';

        //secondPath.bounds._width = secondPath.bounds._width - 50;
        //console.log(secondPath.bounds);
        //secondPath.moveTo(project.layers[1]);
        //console.log(project.layers[1].name);
        //project.layers


        //console.log(project.layers[1]._children);

        //project.layers[1]._children[0].scale(2);

        //saveSVG.saveFile();
        //console.log(saveSVG.svgData);
    }


    //声明鼠标键盘事件函数
    {
        view.onFrame = globalDraw; //draw()函数在draw.js文件里，负责实时刷新视图
        myMouseEvent.onMouseDown = globalMouseDown; //mouseDown
        myMouseEvent.onMouseUp = globalMouseUp; //mouseUp
        myMouseEvent.onMouseDrag = globalMouseDrag; //
        myMouseEvent.onMouseMove = globalMouseMove; //}
        myMouseEvent.onKeyUp = globalKeyUp; //}

        //console.log(myMouseEvent);



        //04 创建显示文字定义模块===================================
    }

    //02 实时刷新模块，所有需要实时刷新的内容都在这
    function globalDraw(event) {
        //project.clear();
        dvdCurve.draw();
        sketchWindow.draw();
        //saveSVG.draw(event);

    }

    //0
    function globalMouseDown(event) {
        myPanel.onMouseDown(event); //先更新myPanel的status变量






        dvdCurve.drawing = myPanel.status;
        dvdCurve.simplifyLevel = myPanel.simplifyLevel; //

        dvdCurve.onMouseDown(event);
        sketchWindow.onMouseDown(event);

    }

    //0
    function globalMouseDrag(event) {
        dvdCurve.onMouseDrag(event);
        sketchWindow.onMouseDrag(event);
    }

    //全局mouseUp用于在不同的类之间通信
    function globalMouseUp(event) {
        //var localSvg = project.importSVG('svg files/heart.svg');


        dvdCurve.onMouseUp(event);
        sketchWindow.onMouseUp(event);

        /* myPanel.tagButton[0].button1.onDoubleClick = function(event) {
            console.log('dvdCurve');
        } */

        //从sketchWindow发送图形
        if (myPanel.sendSketchShapesButton.button1.hitTest(event.point)) {

            sketchWindow.generateForSend(); //添加图形到 shapesForSend
            dvdCurve.receivePattern(sketchWindow.shapesForSend);
            sketchWindow.shapesForSend.myShapeGroup.length = 0;
            dvdCurve.changeShapeGroupDisplay('noChange', 'red', 0);

        }

        //接受svg图形
        if (myPanel.getTextButton.button1.hitTest(event.point)) {

            dvdCurve.drawing = 'svg'; //首先切换绘图模式，以免执行其他模式代码

            let svg = textbox1.value;
            let group = project.importSVG(svg);
            //console.log(group);

            //将这个svg group转换成smartShapeGroup格式
            let tempSmartShapeGroup = new smartShapeGroup();
            for (let i = 0; i < group._children.length; i++) {
                tempSmartShapeGroup.pushNewShape(group._children[i]);
            }

            //dvdCurve.shapeGroup.uniteSelectedShapes(tempSmartShapeGroup);
            dvdCurve.receivePattern(tempSmartShapeGroup);

            //取消输入图形的显示
            for (let i = 0; i < tempSmartShapeGroup.myShapeGroup.length; i++) {
                tempSmartShapeGroup.myShapeGroup[i].myShape.remove();
            }

            dvdCurve.changeShapeGroupDisplay('noChange', 'red', 0);


        } //if 结束


        //替换基本图形
        if (myPanel.getShapeButton.button1.hitTest(event.point)) {

            dvdCurve.drawing = 'svg'; //首先切换绘图模式，以免执行其他模式代码

            let svg = textbox1.value;
            let group = project.importSVG(svg);

            //将这个svg group转换成smartShapeGroup格式
            let tempSmartShapeGroup = new smartShapeGroup();
            for (let i = 0; i < group._children.length; i++) {
                tempSmartShapeGroup.pushNewShape(group._children[i]);
            }

            dvdCurve.shapeGroup.uniteSelectedShapes(tempSmartShapeGroup);
            //dvdCurve.receivePattern(tempSmartShapeGroup);

            //取消输入图形的显示
            for (let i = 0; i < tempSmartShapeGroup.myShapeGroup.length; i++) {
                tempSmartShapeGroup.myShapeGroup[i].myShape.remove();
            }

            dvdCurve.changeShapeGroupDisplay('noChange', 'red', 0);


        } //if 结束

        //接受tag
        if (myPanel.sendTagButton.button1.hitTest(event.point)) {
            //console.log(myPanel.currentTag);
            dvdCurve.getTag(myPanel.currentTag);
        }



        //导出svg
        {
            var svg = project.exportSVG(project.layers[1]);
            saveSVG.svgData = svg;
            saveSVG.onMouseUp(event)
        }


        console.log('======= a mouse up cycle finished  =========');
    }

    //0
    function globalMouseMove(event) {
        dvdCurve.onMouseMove(event);
        sketchWindow.onMouseMove(event);
    }

    //0
    function globalKeyUp(event) {
        //console.log('key up!');
        myPanel.onKeyUp(event);
        //dvdCurve.currentTag = myPanel.currentTag;

        dvdCurve.onKeyUp(event);
        sketchWindow.onKeyUp(event);

        //================================================================

        if (event.key == 't') {
            dvdCurve.deselectAll();

            for (let i = 0; i < dvdCurve.shapeGroup.myShapeGroup.length; i++) {


                for (let j = 0; j < dvdCurve.shapeGroup.myShapeGroup[i].myTag.length; j++) {

                    if (dvdCurve.shapeGroup.myShapeGroup[i].myTag[j] == myPanel.currentTag) {

                        console.log('currentTag: ' + myPanel.currentTag);
                        //
                        dvdCurve.shapeGroup.myShapeGroup[i].myShape.selected = true;


                    }
                }



            }

        }


        /* for (let i = 0; i < myPanel.tagButton.length; i++) {
            myPanel.tagButton[i].button1.onDoubleClick = function() {
                console.log(i);
                console.log(myPanel.currentTag);
                console.log(myPanel.tagButton.length);

                for (let j = 0; j < dvdCurve.shapeGroup.myShapeGroup.length; j++) {
                    for (let k = 0; k < dvdCurve.shapeGroup.myShapeGroup[j].myTag.length; k++) {
                        if (dvdCurve.shapeGroup.myShapeGroup[j].myTag[k] == myPanel.currentTag) {

                            console.log('yes');
                        }
                    }



                }


            }

        } */


        //在这上面写代码=================================================================
        //}
    }







}