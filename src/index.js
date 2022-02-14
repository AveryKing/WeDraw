import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import PixiPlugin from "gsap/PixiPlugin";
import MotionPathPlugin from "gsap/MotionPathPlugin";

// Register plugins
gsap.registerPlugin(PixiPlugin);
gsap.registerPlugin(MotionPathPlugin);
PixiPlugin.registerPIXI(PIXI);

// Create PIXI canvas
const app = new PIXI.Application({
    width: 800,
    height: 500,
    backgroundColor: 0xffffff,
    antialias: true
})
app.view.style.border = '1px solid black';
app.view.style.borderRadius = '8px'
app.view.interactive = true;
app.stage.sortableChildren = true;

// Draws points on the canvas
const draw = ({x, y}, introScreen = false, color) => {
    if (!introScreen && x < 70) return;
    if (!introScreen) color = selectedColor._fillStyle.color;
    const point = new PIXI.Graphics();
    point.beginFill(color);
    point.lineStyle(1, color);
    point.drawCircle(0, 0, 4, 4);
    point.endFill();
    var texture = app.renderer.generateTexture(point);
    var sprite = new PIXI.Sprite(texture);
    introScreen ? app.stage.addChild(sprite) : background.addChild(sprite);
    sprite.x = x, sprite.y = y;
    sprite.anchor.set(introScreen ? .5 : 4, introScreen ? -3 : 1)
}

// "WeDraw" logo on intro screen
const header = PIXI.Sprite.from('https://i.imgur.com/S8iM1Um.png');
header.scale.set(0.8)
header.x = 200;
header.zIndex = 1000;
header.y = 100;
app.stage.addChild(header);
gsap.from(header, {
    duration: 3,
    y: -300,
    alpha: 0,
    ease: "bounce.out"
})

// Default pen colors
const penColors = [
    {name: "black", color: "000000"},
    {name: "red", color: "ff0000"},
    {name: "blue", color: "0036FF"},
    {name: "green", color: "087B00"},
    {name: "yellow", color: "FFDC00"},
    {name: "purple", color: "AD00FF"},
];

const startAutoPens = () => {
    /// Auto drawing pens for intro screen ///
    const penUrl = 'https://raw.githubusercontent.com/AveryKing/WeDraw/6914e51bbf45d821cc2d707b5f29a7196444003e/create_black_36dp.svg';
    const autoPenPaths = [
        [{"x": 731, "y": 458}, {"x": 778, "y": 327}, {"x": 659, "y": 199}, {"x": 743, "y": 60}],
        [{"x": 147, "y": 44}, {"x": 57, "y": 179}, {"x": 195, "y": 319}],
        [{"x": 622, "y": 164}, {"x": 409, "y": 348}, {"x": 684, "y": 431}],
        [{"x": 28, "y": 359}, {"x": 126, "y": 205}, {"x": 309, "y": 248}, {"x": 344, "y": 426}, {"x": 549, "y": 325}],
        [{"x": 694, "y": 15}, {"x": 443, "y": 93}, {"x": 233, "y": 10}]


    ]
    const allPenDetails = [
        {
            color: "0xff0000", path: autoPenPaths[0],
            pos: {x: 731, y: 458}, rotation: 180,
            anchor: {x: 0.9, y: 1.5}, stopPos: {y: 450, type: "greater"}
        },
        {
            color: "0x0036ff", path: autoPenPaths[1],
            pos: {x: 114, y: 15}, rotation: 0, stopPos: {y: 45, type: "less"},
            anchor: {x: 0, y: 0}
        },
        {
            color: "0xAD00FF", path: autoPenPaths[2],
            pos: {x: 622, y: 164}, rotation: 0, stopPos: {},
            anchor: {x: 0, y: 0}
        },
        {
            color: "0xFFDC00", path: autoPenPaths[3],
            pos: {x: 28, y: 459}, rotation: 0, stopPos: {},
            anchor: {x: 0, y: 0}
        },
        {
            color: "0x00EE08", path: autoPenPaths[4],
            pos: {x: 694, y: 15}, rotation: 0, stopPos: {},
            anchor: {x: 0, y: 0}
        }
    ];
    /** AutoPens Structure:
     * [{autoPen}, {autoPen}, ...]
     * autoPen: {sprite, drawInterval, path,color}
     */


    const autoPens = [];
    for (let i = 0; i < allPenDetails.length; i++) {
        const penDetails = allPenDetails[i];
        const pen = PIXI.Sprite.from(penUrl);
        pen.x = penDetails.pos.x, pen.y = penDetails.pos.y;
        pen.rotation = penDetails.rotation;
        pen.anchor.set(penDetails.anchor.x, penDetails.anchor.y);
        const drawInterval = setInterval(() => {
            draw({'x': pen.x, 'y': pen.y}, true, penDetails.color)
        }, 100);

        const stopInterval = setInterval(() => {
            const chosenCoordinate = Object.keys(penDetails.stopPos)[0];
            const timeToClear = penDetails.stopPos.type === 'greater'
                ? pen[chosenCoordinate] > penDetails.stopPos[chosenCoordinate]
                : pen[chosenCoordinate] < penDetails.stopPos[chosenCoordinate];
            if (timeToClear) {
                clearInterval(drawInterval);
                gsap.to(pen, {alpha: 0, duration: 5})
            }
        })
        app.stage.addChild(pen)
        gsap.from(pen, {
            alpha: 0,
            duration: 3
        })
        gsap.from(pen, {
            duration: 25,
            repeat: 0,
            ease: "power1.inOut",
            motionPath: {
                path: penDetails.path,
                curviness: 0.7
            }
        });
    }

}

startAutoPens();


// Coordinate Logger
const logPath = [];
app.view.onclick = (e) => {
    const rect = app.view.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    logPath.push({x: x, y: y});
    console.log(logPath);
}
/////////////////////////////////////

const startApplication = () => {
    let stageInteractive = true;

    const toggleStageInteractive = () => {
        for (let i = 0; i < colorButtons.length; i++) {
            Object.values(colorButtons[i])[0].interactive = !stageInteractive;
        }
        background.interactive = !stageInteractive;
        stageInteractive = !stageInteractive;
    }
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
        while (background.children.length > 0) {
            background.children.forEach(child => {
                child.destroy();
            })
        }

    }
    const colorButtons = [];
    let firstYPosition = 30;
    let selectedColor = undefined;
    const updateSelectedColor = (color) => {
        if (selectedColor) selectedColor.removeSelected();
        selectedColor = color;
        color.makeSelected();
    }
    for (let i = 0; i < penColors.length; i++) {
        const color = new PIXI.Graphics();
        color.interactive = true;
        color.buttonMode = true;
        color.beginFill(`0x${penColors[i].color}`);
        color.lineStyle(4, 0xc9c9c9);
        const circle = color.drawCircle(30, firstYPosition + 60 * i, 20, 20);
        color.mouseover = (e) => {
            color.clear();
            color.beginFill(`0x${penColors[i].color}`)
            color.lineStyle(2, 0x00FF39);
            color.drawCircle(30, firstYPosition + 60 * i, 20, 20);
        }
        color.mouseout = () => {
            color.clear();
            color.beginFill(`0x${penColors[i].color}`)
            color.lineStyle(4, 0xc9c9c9);
            color.drawCircle(30, firstYPosition + 60 * i, 20, 20);
            color.removeChild(color.children[0]);
        }

        color.makeSelected = () => color.x += 10;
        color.removeSelected = () => color.x -= 10;
        color.endFill();
        color.name = penColors[i].name;
        const colorsObj = {}

        color.click = () => {
            updateSelectedColor(colorButtons[i][color.name]);
        }
        colorsObj[color.name] = color
        colorButtons.push(colorsObj);

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
    clearButton.y = penColors.length * 50 + 100;
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
        gsap.from(overlay, {
            duration: 0.5,
            alpha: 0
        })
        const dialogContainer = new PIXI.Container();
        const dialog = new PIXI.Graphics();
        /*
        gsap.from(dialog, 2, {
              pixi:{alpha:0,scale:0.5},ease:"elastic",stagger:1
        });
        gsap.to(dialog, 2, {pixi:{lineColor:"purple"}});
    */
        gsap.from(dialogContainer, {
            duration: 0.5,
            y: -300,
            alpha: 0,
            ease: "circ"
        });
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
            const buttonType = buttons[i].text === "Yes" ? 1 : 2;
            button.click = () => {
                if (buttonType === 1) background.doClear();

                gsap.to(dialogContainer, {
                    duration: 1,
                    y: -300,
                    alpha: 0,
                    ease: "circ"
                });
                gsap.to(overlay, {
                    alpha: 0,
                    duration: 0.7
                })
                toggleStageInteractive();
            }
            button.addChild(buttonText);
            dialogContainer.addChild(button);
        }

    }
    clearButton.click = () => confirmClear();
    app.stage.addChild(clearButton);
    artBoard.addChild(background);
    app.stage.addChild(artBoard);
}

document.body.appendChild(app.view)

