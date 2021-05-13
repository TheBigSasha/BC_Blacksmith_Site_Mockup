// html setup
var itemsHTMLCollection = document.getElementsByClassName('parallax-item');
var itemsArray = Array.from(itemsHTMLCollection); // caniuse.com

var html = document.documentElement;
var scrollAmount = html.scrollTop;
var scrollMax = html.scrollHeight - window.innerHeight;

// input setup
var input = {
  scrollY: {
    start: 0,
    end: html.scrollHeight - window.innerHeight,
    current: 0,
  },
  mouseX: {
    start: 0,
    end: window.innerWidth,
    current: 0,
  },
  mouseY: {
    start: 0,
    end: window.innerHeight,
    current: 0,
  },
};

input.scrollY.range = input.scrollY.end - input.scrollY.start;
input.mouseX.range = input.mouseX.end - input.mouseX.start;
input.mouseY.range = input.mouseY.end - input.mouseY.start;

// the translate
var output = {
  x: {
    start: -150,
    end: 150,
    current: 0,
  },
  y: {
    start: -150,
    end: 150,
    current: 0,
  },
  scrollY: {
    start: 0,
    end: 1500, // so the red shows up
    current: 0,
  },
  zIndex: {
    range: 10000,
  },
  scale: {
    start: 1, // original size
    end: 0.2,
  },
  blur: {
    startingDepth: 0.1,
    range: 20, // blurriness
  },
};
output.scale.range = output.scale.end - output.scale.start;
output.x.range = output.x.end - output.x.start;
output.y.range = output.y.end - output.y.start;
output.scrollY.range = output.scrollY.end - output.scrollY.start;

var mouse = {
  x: 0,
  y: 0,
};

var updateInputs = function() {
  // mouse x,y input
  input.mouseX.current = mouse.x;
  input.mouseY.current = mouse.y;
  input.mouseX.fraction = (input.mouseX.current - input.mouseX.start) / input.mouseX.range;
  input.mouseY.fraction = (input.mouseY.current - input.mouseY.start) / input.mouseY.range;

  // scroll y input
  input.scrollY.current = html.scrollTop;
  input.scrollY.fraction = (input.scrollY.current - input.scrollY.start) / input.scrollY.range;
};

var updateOutputs = function() {
  // output x and y
  output.x.current = output.x.end - (input.mouseX.fraction * output.x.range);
  output.y.current = output.y.end - (input.mouseY.fraction * output.y.range);

  // use scroll - but instead of bottom (output.y.end -), from top (output.y.start +)
  output.scrollY.current = output.scrollY.start + (input.scrollY.fraction * output.scrollY.range);
};

var updateEachParallaxItem = function() {
  // apply output to html
  itemsArray.forEach(function(item, i) {
    var depth = parseFloat(item.dataset.depth, 10); // with decimal places

    var itemInput = {
      scrollY: {
        // item moving between a scroll range of 450 - 800 (scrollTop || input.scrollY.current)
        // between output.y.start and output.y.end
        // start: 450, // fraction to be 0
        // end: 800, // fraction to be 1
        start: item.offsetParent.offsetTop,
        // offsetParent the parent to which the child has a relative position
        // offsetTop the distance between the parent and the top of the document
        end: item.offsetParent.offsetTop + window.innerHeight,
      },
    };
    itemInput.scrollY.range = itemInput.scrollY.end - itemInput.scrollY.start;
    itemInput.scrollY.fraction = (input.scrollY.current - itemInput.scrollY.start) / itemInput.scrollY.range;

    var itemOutputYCurrent = output.scrollY.start + (itemInput.scrollY.fraction * output.scrollY.range);


    var itemOutput = {
      x: output.x.current - (output.x.current * depth),
      // scroll movement + mouse movement
      y: (itemOutputYCurrent * depth) + (output.y.current - (output.y.current * depth)),
      zIndex: output.zIndex.range - (output.zIndex.range * depth), // range is 10 000
      scale: output.scale.start + (output.scale.range * depth),
      blur: (depth - output.blur.startingDepth) * output.blur.range,
    };

    item.style.zIndex = itemOutput.zIndex;
    item.style.transform = `scale(${itemOutput.scale}) translate(${itemOutput.x}px, ${itemOutput.y}px)`;
    item.style.filter = `blur(${itemOutput.blur}px)`;
  });
};

var handleMouseMove = function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  updateInputs();
  updateOutputs();
  updateEachParallaxItem();

  // console.log('x', input.mouseX.fraction, 'y', input.mouseY.fraction);
};

var handleScroll = function() {
  updateInputs();
  updateOutputs();
  updateEachParallaxItem();

  // var scrollMax = html.scrollHeight - window.innerHeight;
  // console.log('scroll amount', scrollAmount, 'scrollMax', scrollMax);
};

var handleResize = function (e) {
  input.mouseX.end = window.innerWidth;
  input.mouseY.end = window.innerHeight;
  input.scrollY.end = html.scrollHeight - window.innerHeight;

  input.mouseX.range = input.mouseX.end - input.mouseX.start;
  input.mouseY.range = input.mouseY.end - input.mouseY.start;
  input.scrollY.range = input.scrollY.end - input.scrollY.start;
};

// Event listeners
window.addEventListener('mousemove', handleMouseMove);
document.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleResize); // responsive

// initialize
mouse.x = window.innerWidth * 0.5;
mouse.y = window.innerHeight * 0.5;
updateInputs();
updateOutputs();
updateEachParallaxItem();
