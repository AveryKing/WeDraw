import * as PIXI from 'pixi.js';
import {BlurFilter} from 'pixi-filters';

const app = new PIXI.Application({
    width: 800,
    height: 500,
    backgroundColor: 0xc9c9c9,
    antialias: true
})
let stageInteractive = true;

const toggleStageInteractive = () => {
    for (let i = 0; i < colorButtons.length; i++) {
        Object.values(colorButtons[i])[0].interactive = !stageInteractive;
    }
    background.interactive = !stageInteractive;
    stageInteractive = !stageInteractive;
}
app.view.style.border = '1px solid black';
app.view.style.borderRadius = '8px'
const artBoard = new PIXI.Container;
const background = new PIXI.Graphics();
background.interactive = true;
background.beginFill(0xffffff);
background.drawRect(35, 0, 730, 500);
background.position.set(35, 0);
background.lineStyle(0, 0x000000)
    .moveTo(35, 0)
    .lineTo(35, 500)
background.endFill();
background.drawing = false;
const draw = ({x, y}) => {
    const point = new PIXI.Graphics();
    point.beginFill(selectedColor._fillStyle.color);
    point.lineStyle(1, selectedColor._fillStyle.color);
    point.drawCircle(x, y, 4, 4);
    point.endFill();
    app.stage.addChild(point);
}

background.mousedown = (e) => {
    if (!selectedColor) {
        return alert('Please select a color');
    }
    background.drawing = true;
    draw(e.data.getLocalPosition(app.stage));
}

background.pointermove = (e) => {
    if (background.drawing) {
        draw(e.data.getLocalPosition(app.stage));
    }
}
background.mouseup = () => {
    background.drawing = false;
}
background.doClear = () => {
    for (let i = 0; i < background.children.length; i++) {
        background.removeChild(background.children[i]);
    }
}

const colors = [
    {name: "black", color: "000000"},
    {name: "red", color: "ff0000"},
    {name: "blue", color: "0036FF"},
    {name: "green", color: "087B00"},
    {name: "yellow", color: "FFDC00"},
    {name: "purple", color: "AD00FF"},
]
const colorButtons = [];
let firstYPosition = 30;
let selectedColor = undefined;
const updateSelectedColor = (color) => {
    if (selectedColor) selectedColor.removeSelected();
    selectedColor = color;
    color.makeSelected();
    console.log(color)
}
for (let i = 0; i < colors.length; i++) {
    const color = new PIXI.Graphics();
    color.interactive = true;
    color.buttonMode = true;
    color.beginFill(`0x${colors[i].color}`);
    color.lineStyle(4, 0xc9c9c9);
    color.drawCircle(30, firstYPosition + 50 * i, 20, 20);
    color.mouseover = () => {
        color.clear();
        color.beginFill(`0x${colors[i].color}`)
        color.lineStyle(2, 0x00FF39);
        color.drawCircle(30, firstYPosition + 50 * i, 20, 20);
    }
    color.mouseout = () => {
        color.clear();
        color.beginFill(`0x${colors[i].color}`)
        color.lineStyle(4, 0xc9c9c9);
        color.drawCircle(30, firstYPosition + 50 * i, 20, 20);
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

const clearButton = new PIXI.Graphics();

const clearText = new PIXI.Text('CLEAR', new PIXI.TextStyle({fontSize: 16, fontWeight: 550}));
clearButton.lineStyle(0, 0x000000);
clearButton.drawRect(0, 0, 50, 20);
clearButton.addChild(clearText);
clearButton.buttonMode = true;
clearButton.interactive = true;
clearButton.x = 7;
clearButton.y = colors.length * 50 + 50;
clearButton.mouseover = () => {
    clearButton.clear();
    clearButton.lineStyle(0.8, 0x000000);
    clearButton.drawRect(-3, -3, 62, 24);
}
clearButton.mouseout = () => {
    clearButton.clear();
    clearButton.drawRect(-3, -3, 62, 24);
}
const confirmClear = () => {
    toggleStageInteractive();
    const overlay = new PIXI.Graphics();
    overlay.beginFill(0x000000);
    overlay.drawRect(0, 0, 1000, 1000);
    overlay.width = 1000;
    overlay.height = 1000;
    overlay.alpha = 0.3;
    overlay.endFill();
    app.stage.addChild(overlay);
    const dialogContainer = new PIXI.Container();
    const dialog = new PIXI.Graphics();
    dialog.beginFill(0xffffff);
    dialog.lineStyle(1, 0x00000);
    dialog.drawRoundedRect(app.view.height / 2, app.view.width / 6, 300, 170, 10);
    const title = new PIXI.Text('Are you sure?', new PIXI.TextStyle({fontSize: 25, fontWeight: 'bold'}))
    dialog.addChild(title);
    dialog.endFill();
    dialogContainer.addChild(dialog);
    app.stage.addChild(dialogContainer);
    title.x += 320, title.y += 140;
    dialogContainer.addChild(title);
    const msg = 'Select yes to confirm that you \nwould like to clear the canvas. \n\t\t\t\t\t\t\t\tThis is irreversible.';
    const message = new PIXI.Text(msg, new PIXI.TextStyle({fontSize: 20}));
    dialogContainer.addChild(message);
    message.y = title.y + 30;
    message.x = title.x - 50;
    const buttons = [
        {text: "Cancel"},
        {text: "Yes"}
    ]
    for (var i = 0; i < buttons.length; i++) {
        const button = new PIXI.Graphics();
        button.beginFill(0xc9c9c9);
        button.lineStyle(1, 0x000000);
        button.drawRoundedRect(30, 23, 65, 25, 5);
        button.endFill();
        button.x = message.x + 20 + i * 95
        button.y = message.y + 60;
        const buttonText = new PIXI.Text(buttons[i].text, new PIXI.TextStyle({fontSize: 15}))
        buttonText.x += buttons[i].text === "Yes"
            ? 48
            : 37;
        buttonText.y += 26;
        button.interactive = true;
        button.buttonMode = true;
        button.mouseover = () => {
            button.clear();
            button.beginFill(0x45A9FF);
            button.lineStyle(1, 0x000000);
            button.drawRoundedRect(30, 23, 65, 25, 5);
            button.endFill();
        }
        button.mouseout = () => {
            button.clear();
            button.beginFill(0xc9c9c9);
            button.lineStyle(1, 0x000000);
            button.drawRoundedRect(30, 23, 65, 25, 5);
            button.endFill();
        }
        button.addChild(buttonText);
        dialogContainer.addChild(button);
    }

}
clearButton.click = () => confirmClear();
app.stage.addChild(clearButton);
artBoard.addChild(background);
app.stage.addChild(artBoard);
document.body.appendChild(app.view)

