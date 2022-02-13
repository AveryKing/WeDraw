import * as PIXI from 'pixi.js';
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
background.interactive = true;
background.beginFill(0xffffff);
background.drawRect(35,0,730,500);
background.position.set(35,0);
background.lineStyle(2,0x000000)
    .moveTo(35,0)
    .lineTo(35,500)
background.endFill();
background.drawing = false;
const draw = ({x,y}) => {
    const point = new PIXI.Graphics();
    point.beginFill(selectedColor._fillStyle.color);
    point.lineStyle(1,selectedColor._fillStyle.color);
    point.drawCircle(x,y,4,4);
    point.endFill();
    app.stage.addChild(point);
}

background.mousedown = (e) => {
    if(!selectedColor) {
        return alert('Please select a color');
    }
    background.drawing = true;
    draw(e.data.getLocalPosition(app.stage));
}

background.mousemove = (e) => {
    if(background.drawing) {
        draw(e.data.getLocalPosition(app.stage));
    }
}
background.mouseup = () => {
    background.drawing = false;
}

const colors = [
    { name:"black", color:"000000"},
    { name:"red", color:"ff0000"},
    { name:"blue", color:"0036FF"},
    { name:"green", color:"087B00"},
    { name:"yellow", color:"FFDC00"},
    { name:"purple", color:"AD00FF"},
]
const colorButtons = [];
let firstYPosition = 30;
let selectedColor = undefined;
const updateSelectedColor = (color) => {
    if(selectedColor) selectedColor.removeSelected();
    selectedColor = color;
    color.makeSelected();
    console.log(color)
}
for(let i=0; i<colors.length; i++) {
    const color = new PIXI.Graphics();
    color.interactive = true;
    color.buttonMode = true;
    color.beginFill(`0x${colors[i].color}`);
    color.lineStyle(4,0xc9c9c9);
    color.drawCircle(30,firstYPosition + 50*i,20,20);
    color.mouseover = () => {
        color.clear();
        color.beginFill(`0x${colors[i].color}`)
        color.lineStyle(2,0x00FF39);
        color.drawCircle(30,firstYPosition + 50*i,20,20);
    }
    color.mouseout = () => {
        color.clear();
        color.beginFill(`0x${colors[i].color}`)
        color.lineStyle(4,0xc9c9c9);
        color.drawCircle(30,firstYPosition + 50*i,20,20);
    }

    color.makeSelected = () => color.x += 10;
    color.removeSelected = () => color.x -= 10;

    color.endFill();
    color.name = colors[i].name;
    const colorsObj = {}
    colorsObj[color.name] = color
    colorButtons.push(colorsObj);

    color.click = () => {
        updateSelectedColor(colorButtons[i][color.name]);
    }
    app.stage.addChild(color);
}

function onDragStart(event) {
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}
function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
}
function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}
artBoard.addChild(background);
app.stage.addChild(artBoard);
document.body.appendChild(app.view)

