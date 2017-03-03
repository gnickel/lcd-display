// lcdsegments.js

var segmentEdges = {"a": "top", "b": "right", "c": "right", "d": "bottom", "e": "left", "f": "left", "g": "bottom", "h": "top"};
var segmentEncoding = [
  "abcdef00",  // digit (0)
  "0bc00000",  // digit (1)
  "ab0de0gh",  // digit (2)
  "abcd00gh",  // digit (3)
  "0bc00fgh",  // digit (4)
  "a0cd0fgh",  // digit (5)
  "a0cdefgh",  // digit (6)
  "abc00000",  // digit (7)
  "abcdefgh",
  "abcd0fgh",
  "abc0efgh",
  "00cdefgh",
  "a00def00",
  "0bcde0gh",
  "a00defgh",
  "a000efgh",
  "000000gh"  // speciul case for the minus (-) symbol
];


function scaleStyles(div, styleList, scaleFactor) {
  var styles = $(div).css(styleList);
  for (var i = 0; i < styleList.length; i++) {
    var intstr = styles[styleList[i]].split("px")[0];
    var val = parseFloat(intstr) * scaleFactor;
    styles[styleList[i]] = val.toString() + "px";
  }
  //if (sizeAdjust.width) {
    //scaleStyles["width"] = 0;
  //} else if (sizeAdjust.height) {
    //scaleStyles["height"] = 0;
  //}
  $(div).css(styles);
}

function LCDSegment (container, segmentMap) {
  this.segment = segmentMap;
  this.state = false;
  this.div = $("<div class='lcd-segment segment" + segmentMap + "'></div>");
  $(container).append(this.div);
}

LCDSegment.prototype.scale = function(scaleFactor) {
  //var scaledStyles;// = {};
  var styleQueries = [];
  var sizeAdjust = {"height": false, "width": false};
  switch (segmentEdges[this.segment]) {
    case "left":
      styleQueries.push("border-left-width");
      styleQueries.push("border-top-width");
      styleQueries.push("border-bottom-width");
      sizeAdjust.width = true;
      break;
    case "right":
      styleQueries.push("border-right-width");
      styleQueries.push("border-top-width");
      styleQueries.push("border-bottom-width");
      sizeAdjust.width = true;
      break;
    case "top":
      styleQueries.push("border-top-width");
      styleQueries.push("border-left-width");
      styleQueries.push("border-right-width");
      sizeAdjust.height = true;
      break;
    case "bottom":
      styleQueries.push("border-bottom-width");
      styleQueries.push("border-left-width");
      styleQueries.push("border-right-width");
      sizeAdjust.height = true;
      break;

    default: break;
  }
  styleQueries.push("border-radius");
  styleQueries.push("top");
  styleQueries.push("left");
  styleQueries.push("height");
  styleQueries.push("width");
  //if (sizeAdjust.width) {
    //scaleStyles["width"] = 0;
  //} else if (sizeAdjust.height) {
    //scaleStyles["height"] = 0;
  //}
  scaleStyles(this.div, styleQueries, scaleFactor);
}

LCDSegment.prototype.toggleState = function () {
  this.state = !this.state;
  var borderProp = "border-" + segmentEdges[this.segment] + "-color";
  $(this.div).css(borderProp, this.state ? "rgb(0,0,0)" : "rgba(0,0,0,0.03)");
}

LCDSegment.prototype.display = function(state) {
  if (this.state != state) {
    var borderProp = "border-" + segmentEdges[this.segment] + "-color";
    $(this.div).css(borderProp, state ? "rgb(0,0,0)" : "rgba(0,0,0,0.03)");
    this.state = state;
  }
}
function SegmentA(container) {
  LCDSegment.call(this, container, "a");
}

function LCDDigit(digitID) {
  this.digitID = digitID;
  this.segment = [];
  this.slant = false;
  this.segment.push(new LCDSegment(digitID, "a"));
  this.segment.push(new LCDSegment(digitID, "b"));
  this.segment.push(new LCDSegment(digitID, "c"));
  this.segment.push(new LCDSegment(digitID, "d"));
  this.segment.push(new LCDSegment(digitID, "e"));
  this.segment.push(new LCDSegment(digitID, "f"));
  this.segment.push(new LCDSegment(digitID, "g"));
  this.segment.push(new LCDSegment(digitID, "h"));
}

LCDDigit.prototype.displayValue = function(digitValue) {
  if (digitValue >= 0 && digitValue <= 16) {
    for (var i = 0; i < segmentEncoding[digitValue].length; i++) {
      this.segment[i].display(segmentEncoding[digitValue].charAt(i) != '0');
    }
  }
}
LCDDigit.prototype.blank = function() {
  for (var i = 0; i < 8; i++) {
    this.segment[i].display(false);
  }
}
LCDDigit.prototype.displayAll = function() {
  for (var i = 0; i < segmentEncoding[8].length; i++) {
    this.segment[i].display(segmentEncoding[8].charAt(i) != '0');
  }
}

LCDDigit.prototype.oblique = function(slant) {
  if (this.slant != slant) {
    if (slant) {
      $(this.digitID).css("transform","skewX(-5deg)");
    } else {
      $(this.digitID).css("transform","none");
    }
    this.slant = slant;
  }
}

LCDDigit.prototype.scaleToContainer = function() {
  var containerHeight = $(this.digitID).parent().height();
  var currentHeight = $(this.digitID).height();
  this.scale(containerHeight / currentHeight);
}

LCDDigit.prototype.scale = function(scaleFactor) {
  for (var i = 0; i < 8; i++) {
    this.segment[i].scale(scaleFactor);
  }
  var styleQueries = [];
  styleQueries.push("margin-left");
  styleQueries.push("margin-right");
  styleQueries.push("height");
  styleQueries.push("width");
  scaleStyles(this.digitID, styleQueries, scaleFactor);
}

function LCDSymbol(symbolID) {
  this.symbolID = symbolID;
}
LCDSymbol.prototype.display = function() {
  $(this.symbolID).children().each(function() {
    $(this).css("border-color", "rgb(0,0,0)");
    $(this).css("color", "rgb(0,0,0)");
  });
}

LCDSymbol.prototype.scale = function(scaleFactor) {
  $(this.symbolID).children().each(function() {
    var styleQueries = [];
    styleQueries.push("margin-top");
    styleQueries.push("border-radius");
    styleQueries.push("border-width");
    styleQueries.push("height");
    styleQueries.push("width");
    styleQueries.push("font-size");
    //styleQueries.push("margin");
    scaleStyles($(this), styleQueries, scaleFactor);
  });
  var styleQueries = [];
  styleQueries.push("margin-left");
  styleQueries.push("margin-right");
  styleQueries.push("height");
  styleQueries.push("width");
  scaleStyles(this.symbolID, styleQueries, scaleFactor);
}

LCDSymbol.prototype.scaleToContainer = function() {
  var containerHeight = $(this.symbolID).parent().height();
  var currentHeight = $(this.symbolID).height();
  this.scale(containerHeight / currentHeight);
}
