var xArray = [];
var yArray = [];

var x1 = 0, y1 = 0;
var x2 = 0, y2 = 0;
var x3 = 0, y3 = 0;
var x4 = 1, y4 = 1;

var startHue = 180;
var endHue = 88;
var startSaturation = 39;
var endSaturation = 90;
var startLightness = 54;
var endLightness = 100;
var steps = 10;

  
function fetchValues()
{
  
  var curvemode = document.getElementById('curve-mode');
  switch(curvemode.value)
  {
    case 'ease-in': { x2 = 0.42, y2=0, x3=1, y3 = 1;}; break; 

    case 'ease-out': { x2 = 0, y2 = 0, x3 = 0.58, y3 = 1; }; break; 

    case 'ease-in-out': { x2 = 0.42, y2 = 0, x3 = 0.58, y3 = 1; }; break;
    
    case 'ease': { x2 = 0.25, y2 = 0.1, x3 = 0.25, y3 = 1; }; break;

    case 'linear': { x2 = 0, y2 = 0, x3 = 1, y3 = 1; }; break;

    case 'custom': { 
      x2 = parseFloat(document.getElementById('x2Val').value);
      y2 = parseFloat(document.getElementById('y2Val').value);
      x3 = parseFloat(document.getElementById('x3Val').value);
      y3 = parseFloat(document.getElementById('y3Val').value);
    }; break; 
  }

  var vertices = document.getElementById('vertices');

  if(curvemode.value == 'custom')
  {
    vertices.style.visibility = 'visible';
  }
  else
  {
    vertices.style.visibility = 'hidden';
  }

  startHue = parseInt(document.getElementById('startHue').value)

  endHue = parseInt(document.getElementById('endHue').value)

  startSaturation = parseInt(document.getElementById('startSaturation').value)
  endSaturation = parseInt(document.getElementById('endSaturation').value)

  startLightness = parseInt(document.getElementById('startLightness').value)
  endLightness = parseInt(document.getElementById('endLightness').value)

  steps = parseInt(document.getElementById('steps').value)

}



function calcBezier(time) {
  // var XValue = Math.pow(time,3) - (1.5 * Math.pow(time, 2)) + (1.5 * time)
  // var YValue = (-2 * Math.pow(time,3)) + (3 * Math.pow(time, 2));

  var XValue = Math.ceil(
    (Math.pow(1 - time, 3) * x1 +
      3 * time * Math.pow(1 - time, 2) * x2 +
      3 * Math.pow(time, 2) * (1 - time) * x3 +
      Math.pow(time, 3) * x4) *
      100
  );

  var YValue = Math.ceil(
    (Math.pow(1 - time, 3) * y1 +
      3 * time * Math.pow(1 - time, 2) * y2 +
      3 * Math.pow(time, 2) * (1 - time) * y3 +
      Math.pow(time, 3) * y4) *
      100
  );

  xArray.push(XValue);
  yArray.push(YValue);

  // console.log(xArray)
  // console.log(XValue)

  var HueValues = Math.floor((XValue/ 100) * (endHue - startHue) + startHue);
  var SaturationValues = Math.floor(
    (XValue/ 100) * (endSaturation - startSaturation) + startSaturation
  );
  var LightnessValues = Math.floor(
    (XValue/ 100) * (endLightness - startLightness) + startLightness
  );

  // console.log(LightnessValues)

  addColorBox(HueValues, SaturationValues, LightnessValues);
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function addColorBox(h, s, l) {

  var wrapper = document.getElementById('right')

  var createdDiv = document.createElement("div");
  createdDiv.setAttribute("class", "box");
  var color = "hsl(" + h + ", " + s + "%, " + l + "%)";
  // console.log(color)
  createdDiv.style.background = color;

  var colorText = document.createElement("p");
  var colorHex = hslToHex(h,s,l);
  colorText.innerHTML = colorHex + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + color;
  createdDiv.appendChild(colorText);
  createdDiv.addEventListener('click', () => {
    navigator.clipboard.writeText(colorHex)
    console.log(colorHex)
    colorText.innerHTML = "Hex copied!"
  })

  createdDiv.addEventListener('mouseleave', () => {
    colorText.innerHTML = colorHex + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + color;
  })
  wrapper.appendChild(createdDiv);
  var colorbox = document.getElementsByClassName('right-wrapper')[0];
  colorbox.appendChild(wrapper)
  
}

function drawCurve(steps) {
  var i = 0;
  while (i <= 1) {
    calcBezier(i);
    i = i + 1 / steps;
  }

}

// Define Data


function removeOldColors()
{
  var colorbox = document.getElementsByClassName('right-wrapper')[0];

  if(colorbox.childElementCount != 0)
  {
    colorbox.removeChild(document.getElementById('right'))
    var wrapper = document.createElement("div");
    wrapper.setAttribute('class', 'right')
    wrapper.setAttribute('id', 'right')
    colorbox.appendChild(wrapper)
  }
  xArray = [];
  yArray = [];
  // console.log(colorbox)

}

function showValuesNearSliders()
{
  document.getElementById('startHueVal').innerHTML = startHue;
  document.getElementById('endHueVal').innerHTML = endHue;
  document.getElementById('startSaturationVal').innerHTML = startSaturation;
  document.getElementById('endSaturationVal').innerHTML = endSaturation;
  document.getElementById('startLightnessVal').innerHTML = startLightness;
  document.getElementById('endLightnessVal').innerHTML = endLightness;
  document.getElementById('stepsVal').innerHTML = steps;
  document.getElementById('x2Value').innerHTML = x2;
  document.getElementById('y2Value').innerHTML = y2;
  document.getElementById('x3Value').innerHTML = x3;
  document.getElementById('y3Value').innerHTML = y3;
}

function loadColors()
{

  removeOldColors()
  fetchValues()
  showValuesNearSliders()
  drawCurve(steps);

  // console.log(xArray)

  var data = [
    {
      x: xArray,
      y: yArray,
      mode: "lines",
      line: {
        color: 'rgb(250, 204, 0)'
      }
    },
  ];
  
  // Define Layout
  var layout = {
    xaxis: { range: [0, 100], linecolor: 'rgb(49,130,189)', linewidth: 2, tickcolor: 'rgba(255,0,0,0)', showgrid : false, showticklabels: false, showline: false, zeroline: false },
    yaxis: { range: [0, 100], linecolor: 'rgb(49,130,189)', linewidth: 2, tickcolor: 'rgba(255,0,0,0)', showgrid : false, showticklabels: false,showline: false, zeroline: false },
    paper_bgcolor: 'rgba(0,0,0,0)',
    grid_color: 'rgba(0,0,0,0)',
    
    plot_bgcolor: 'rgba(0,0,0,0)',
    title: {
      text: 'Bezier Curve',
      font: {
        color: 'rgb(250, 204, 0)'
      }
    }
    // titlecolor: 'rgb(255,255,255)'
  };

  Plotly.newPlot("myPlot", data, layout);
}

loadColors()


