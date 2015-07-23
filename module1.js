/* I begin by defining a class.*/

class ImageUtils {
    /* A function called getCanvas takes the width and height of an image as parameters, to create a canvas object of this size. */
    static getCanvas(w, h) {
        var c = document.querySelector("canvas");
        c.width = w;
        c.height = h;
        return c;
    }

    /* These two functions are involved with obtaining the referenced image file's contents and transferring them to a canvas.
     * I can't really tell them apart.*/
    static getPixels(img) {
        var c = ImageUtils.getCanvas(img.width, img.height);
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0,0,c.width,c.height);
    }

    static putPixels(imageData, w, h) {
        var c = ImageUtils.getCanvas(w, h);
        var ctx = c.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
    }

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function definitions here

function plasma(img) {
    var pixels = ImageUtils.getPixels(img);
    var length = pixels.data.length;
    var data = pixels.data;
    console.log(pixels);

    /* Select the top-left coordinates of a random 50x50 square */
    var x = getRandomInt(0, img.width-50);
    var y = getRandomInt(0, img.height-50);

    /* Vary transparency according to the distance from the centre of the square.
     * Square 25x25 is actually represented by four values.
     * Given that there are 50*4 = 200 values in a row, and we are looking in the 25th row, this means that the previous 24 rows are described by 200*24 = 4800 values.
     * The 4799th value is the last of these, and I still have 24 pixels sharing the same row remaining.
     * 24*4 = 96, and thus 4799 + 96 = 4895.
     * The fully opaque pixel will thus be represented by values 4896-4899, where value (alpha) is 4899=255. */

    /* This FOR loop has simplified the following process as a pixel is now referencable as an array within an array. */
    //for (var i = 3; i < length; i += 4){
    //    data_new.push([i-3, i-2, i-1, i]);
    //}

    var colour = new RGBA();

    for (var i = 0; i < Math.pow(50,2); i += 4) {
        /* Using the Pythagorean theorem, I must carefully manipulate each alpha value according to the pixel's distance from the pixel (25,25).
         * The maximum possible Alpha value (255) is divided by the distance between the pixel in question and the central one.
         * Assuming that we are now dealing with a single length of 50, 50 px lengths:
         * - A floor division will tell us what row the pixel is in.
         * - A modulus function (remainder of a division) will tell us how-far-along-the-row it is (the column it is in). I have rounded this for safety... I don't feel fully confident that a floor will work. */
        var pixelXCoord = Math.floor(i/50);
        var pixelYCoord = Math.round(i%50);

        var originalRGBA = new RGBA(data[i], data[i+1], data[i+2], data[i+3]);
        //console.log("original: ", originalRGBA);
        var modifiedRGBA = modifyPixel(pixelXCoord, pixelYCoord, originalRGBA);
        //console.log("modified:", modifiedRGBA);

        data[i] = modifiedRGBA.red;
        data[i+1] = modifiedRGBA.green;
        data[i+2] = modifiedRGBA.blue;
        data[i+3] = modifiedRGBA.alpha;
    }

    /* I then need to return the array to it's original state.*/
    /*for (var i = 0; i < length; i += 4) {
        for (var j = 0; j < 3; j++){
            data.push(data_new[i][j]);
        }
    }*/
    pixels.data.set(pixels);
    console.log(pixels);
    ImageUtils.putPixels(pixels, img.width, img.height);
}

function modifyPixel(pixelXCoord, pixelYCoord, originalRGBA) {
    var modifiedRGBA = new RGBA(0, originalRGBA.green, originalRGBA.blue, originalRGBA.alpha);
    //modifiedRGBA.alpha = 255 / (Math.sqrt(Math.pow(pixelXCoord - 25, 2) + (Math.pow(pixelYCoord - 25, 2))));
    return modifiedRGBA;
}

/* Select a random RGB value*/
function randomiseAllRGB() {
    var rgb = [];
    for (var i = 0; i < 3; i++) {
        rgb.push(getRandomInt(0, 255));
    }
}

class RGBA {
    constructor(redValue, greenValue, blueValue, alphaValue) {
        this.red = redValue;
        this.green = greenValue;
        this.blue = blueValue;
        this.alpha = alphaValue;
    }
}

class Point {
    constructor(xValue, yValue){
        this.x = xValue;
        this.y = yValue;
    }
}

$(document).ready(function() {
    var img = new Image();
    img.src = "img/bridge.jpg";
    plasma(img);

    //var pixels = ImageUtils.getPixels(img);
    //console.log(pixels);
    //ImageUtils.putPixels(pixels, img.width, img.height);
});