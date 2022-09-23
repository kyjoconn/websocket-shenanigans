import io from "socket.io-client"

var socket;

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const myColor = [randomIntFromInterval(0, 255), randomIntFromInterval(0, 255), randomIntFromInterval(0, 255)];

let alreadyRun = false; // fix weird bug where two canvases were getting rendered
export const setup = (p5, canvasParentRef: Element): void => {
    if (!alreadyRun) {
        alreadyRun = true;
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);

        p5.background(0);


        const socketInitializer = async () => {
            // create socket server if one does not exist
            await fetch('/api/socket')

            // open socket between client and server, defaults to window.location
            // defaults to ws://{window.location}
            socket = io("ws://myfastapi")

            socket.on('connect', () => {
                console.log('connected')
            });

            socket.on('mouse',
                // When we receive data
                function (data) {
                    console.log("Got: " + data.x + " " + data.y);
                    // Draw a circle
                    p5.fill(data.color[0], data.color[1], data.color[2]);
                    p5.noStroke();
                    p5.ellipse(data.x, data.y, 20, 20);
                }
            );
        }

        socketInitializer();
    }
}

export const draw = (p5): void => {
  //do nothing on each frame
}

export const mouseDragged = (p5) => {
    // Draw a circle
    p5.fill(myColor[0], myColor[1], myColor[2]);
    p5.noStroke();
    p5.ellipse(p5.mouseX, p5.mouseY,20,20);
    // Send the mouse coordinates
    console.log(p5.mouseX, p5.mouseY);
    sendMouse(p5.mouseX, p5.mouseY);
}

// Function for sending to the socket
const sendMouse = (xpos, ypos) => {
    // We are sending!
    console.log("sendmouse: " + xpos + " " + ypos);

    // Make a little object with  and y
    var data = {
        x: xpos,
        y: ypos,
        color: myColor
    };

    // Send that object to the socket
    socket.emit('mouse', data);
}