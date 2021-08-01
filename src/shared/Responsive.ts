declare global {
  interface Window {
      // experemental property, which if does not exist
      // uses just viewport
      //@ts-ignore
      readonly visualViewport: VisualViewport;
  }
}

export function scaleToWindow(canvas: HTMLCanvasElement, backgroundColor: number) {
let scaleX, scaleY, scale, marginLeft, marginTop;

//1. Scale the canvas to the correct size
//Figure out the scale amount on each axis
let width = Infinity;
let height = Infinity;
if(window.visualViewport) {
    width = Math.min(window.visualViewport.width, width);
    height = Math.min(window.visualViewport.height, height);
}
width = Math.min(window.innerWidth, width);
height = Math.min(window.innerHeight, height);

scaleX =width / canvas.offsetWidth;
scaleY = height / canvas.offsetHeight;
//Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
scale = Math.min(scaleX, scaleY);
canvas.style.transformOrigin = "0 0";
canvas.style.transform = "scale(" + scale + ")";

//2. Center the canvas.
marginLeft = (window.innerWidth - canvas.getBoundingClientRect().width)/2;
marginTop = (window.innerHeight - canvas.getBoundingClientRect().height)/2;
canvas.style.marginTop = marginTop + "px";
canvas.style.marginLeft = marginLeft + "px";

//3. Remove any padding from the canvas  and body and set the canvas
//display style to "block"
canvas.style.paddingLeft = 0 + "px";
canvas.style.paddingRight = 0 + "px";
canvas.style.paddingTop = 0 + "px";
canvas.style.paddingBottom = 0 + "px";
canvas.style.display = "block";

//4. Set the color of the HTML body background
document.body.style.backgroundColor = backgroundColor.toString();

//Fix some quirkiness in scaling for Safari
let ua = navigator.userAgent.toLowerCase();
if (ua.indexOf("safari") != -1) {
    if (ua.indexOf("chrome") > -1) {
        // Chrome
    } else {
        // Safari
        //canvas.style.maxHeight = "100%";
        //canvas.style.minHeight = "100%";
    }
}

//5. Return the `scale` value. This is important, because you'll nee this value 
//for correct hit testing between the pointer and sprites
return scale;
}