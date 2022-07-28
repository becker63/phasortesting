import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import { Chart } from 'chart.js';

// when mouse first clicked
let startX: number;

// array of annotations
let annotationArray: any;

// id of anno you clicked in annotation array
// by defualt its -1 because thats not an array index
let selectedAnnotation: number = -1;

// whether you have even selected a annotation
let annotationSelected: boolean = false;

const calcMousePos = (e: any, chartInstance: any) => {
  // Calculates mouse x on chart
  const xTop = chartInstance.chartArea.left;
  const xBottom = chartInstance.chartArea.right;
  const xMin = chartInstance.config.options.scales.x.min;
  const xMax = chartInstance.config.options.scales.x.max;
  // TODO: make this faster
  let newX: number = Math.abs((e.offsetX - xTop) / (xBottom - xTop));
  newX = newX * Math.abs(xMax - xMin) + xMin;
  return newX;
};

function optionsCheck(chartInstance: any) {
  const options = chartInstance.config.options.plugins.dragData;
  const output = { enabled: true, trip: false };
  switch (options) {
    case !options.enabled || options.enabled === false:
      output.enabled = false;
      break;
    default:
      return output;
  }

  return output;
}

function getElement(
  e: any,
  chartInstance: any,
  callback: (
    selectedAnnotation: number,
    annotation: any,
    chartInstance: any
  ) => void
) {
  // Checks is enabled is set to true in options
  const optionscheck = optionsCheck(chartInstance);
  if (optionscheck?.enabled === true) {
    // contains a list of the distance between the mouse and the annotations
    const annotations: { distance: number; annotationId: number }[] = [];

    annotationArray =
      chartInstance.config.options.plugins.annotation.annotations;
    for (let i = 0; i < annotationArray.length; i += 1) {
      if (annotationArray[i].draggable === true) {
        const annotationX = annotationArray[i].xMax;
        const dist = Math.abs(annotationX - calcMousePos(e, chartInstance));
        annotations.push({ distance: dist, annotationId: i });
      } else {
        annotationSelected = false;
      }
    }

    // smaller this is closer the mouse
    const closest = Math.min(...annotations.map((o) => o.distance));

    // Threshold, this should be changed depending on the width of the line, its fiddley but calculating this dynamically based off the size of the line is annoying and a waste of the main thread
    const t = 10;
    if (closest >= -t && closest <= t) {
      annotations.forEach((element) => {
        if (closest === element.distance) {
          selectedAnnotation = element.annotationId;
          annotationSelected = true;
          startX = calcMousePos(e, chartInstance);

          chartInstance.update();
        }
      });
      if (callback || typeof callback === 'function') {
        callback(
          selectedAnnotation,
          annotationArray[selectedAnnotation],
          chartInstance
        );
      }
    } else {
      annotationSelected = false;
    }
  } else {
    annotationSelected = false;
  }
}

const updateAnnotationOnEvent = (
  e: any,
  chartInstance: any,
  callback: (
    selectedAnnotation: number,
    annotation: any,
    chartInstance: any
  ) => void
) => {
  if (!annotationSelected) {
    return;
  }

  const curAnnotation = annotationArray[selectedAnnotation];

  const newX = calcMousePos(e, chartInstance);
  const distance = newX - startX;
  const x = startX + distance;

  curAnnotation.xMax = x.toString();
  curAnnotation.xMin = x.toString();
  chartInstance.update();
  if (callback || typeof callback === 'function') {
    callback(
      selectedAnnotation,
      annotationArray[selectedAnnotation],
      chartInstance
    );
  }
};

const cleanup = (
  chartInstance: any,
  callback: (
    selectedAnnotation: number,
    annotation: any,
    chartInstance: any
  ) => void
) => {
  if (annotationSelected === true) {
    chartInstance.update();
    annotationSelected = false;
    if (callback || typeof callback === 'function') {
      callback(
        selectedAnnotation,
        annotationArray[selectedAnnotation],
        chartInstance
      );
    }
  }
};

const Drag = {
  id: 'dragData',
  afterInit(chartInstance: any) {
    if (
      chartInstance.config.options.plugins &&
      chartInstance.config.options.plugins.dragData
    ) {
      select(chartInstance.canvas).call(
        drag()
          .container(chartInstance.canvas)
          .on('start', (e) =>
            getElement(
              e.sourceEvent,
              chartInstance,
              chartInstance.config.options.plugins.dragData.onDragStart
            )
          )
          .on('drag', (e) =>
            updateAnnotationOnEvent(
              e.sourceEvent,
              chartInstance,
              chartInstance.config.options.plugins.dragData.onDrag
            )
          )
          .on('end', () =>
            cleanup(
              chartInstance,
              chartInstance.config.options.plugins.dragData.onDragEnd
            )
          )
      );
    }
  },
};

Chart.register(Drag);

export default Drag;
