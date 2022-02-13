import * as PIXI from 'pixi.js';
//var renderer = PIXI.autoDetectRenderer(800, 600);
//document.body.appendChild(renderer.view);

const app = new PIXI.Application({
    width:800,
    height:500,
    backgroundColor: 0xc9c9c9,
    antialias:true
})
app.view.style.border = '1px solid black';
app.view.style.borderRadius = '8px'
const artBoard = new PIXI.Container;
const background = new PIXI.Graphics();
background.beginFill(0xffffff);
background.drawRect(35,0,730,500);
background.position.set(35,0);
background.lineStyle(2,0x000000)
    .moveTo(35,0)
    .lineTo(35,500)
background.endFill();

const colors = [
    { name:"red", color:"ff0000"},
    { name:"blue", color:"0036FF"},
    { name:"green", color:"087B00"},
    { name:"yellow", color:"FFDC00"},
    { name:"purple", color:"AD00FF"},
]
let firstYPosition = 30;
for(let i=0; i<colors.length; i++) {
    const color = new PIXI.Graphics();
    color.interactive = true;
    color.beginFill(`0x${colors[i].color}`);
    color.drawCircle(30,firstYPosition + 50*i,20,20);
    color.mouseover = () => {
        color.scale.set(1.02);
    }
    color.mouseout = () => {
        color.scale.set(1);
    }
    color.endFill();
    app.stage.addChild(color);
}


const test = new PIXI.Graphics();
test.beginFill(0xFF0000);
test.drawCircle(100,100,20,20);
test.lineStyle(3,0xffffff);
test.endFill();
const texture = app.renderer.generateTexture(test);
const sprite = new PIXI.Sprite(texture);
sprite.interactive = true;
sprite.anchor.set(0.5);
background.addChild(sprite);
sprite.x = 100;
sprite.y = 100;

function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}


sprite
    .on('mousedown', onDragStart)
    .on('mousemove', onDragMove)
    .on('mouseup', onDragEnd)


//const {x,y} = e.data.getLocalPosition(app.stage)

artBoard.addChild(background);
app.stage.addChild(artBoard);
document.body.appendChild(app.view)

