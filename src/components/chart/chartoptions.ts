import { ChartData, ChartOptions } from "chart.js";
import { MutableRefObject } from "react";
import { AnnotationOptions } from "chartjs-plugin-annotation";
import { useBus } from 'react-bus';

const generateLineAnnotations = (): AnnotationOptions[] => {
  const annos: AnnotationOptions[] = [];

  annos.push({
    type: "line",
    xMin: 2,
    xMax: 2,
    draggable: true,
    borderWidth: 5,
    label: {
      enabled: true,
      content: "START",
      position: "start",
      padding: 2,
      borderRadius: 3,
    },
  } as any);

  annos.push({
    type: "line",
    yMin: 5,
    yMax: 5,
    borderColor: '#2F2F2F',
    borderWidth: 5,
    label: {
      enabled: true,
      padding: 2,
      borderRadius: 3,
    },
  } as any);

  return annos;
};

const useChart = (
  chartRef: MutableRefObject<any | undefined>,
  constants: { minX: number; maxX: number; minY: number; maxY: number }
) => {
  const annotations = generateLineAnnotations();
  const bus = useBus()

  const options: ChartOptions = {
    scales: {
      x: {
        type: "linear",

        min: constants.minX,
        max: constants.maxX,
      },
      y: {
        type: "linear",

        min: constants.minY,
        max: constants.maxY,
      },
    },

    plugins: {
      dragData: {
        enabled: true,
        onDrag(
          selectedAnnotationIndex: number,
          selectedAnnotation: any,
          chartInstance: any
        ) {
          const payload = {
            selectedAnnotation,
            selectedAnnotationIndex,
            chartInstance
          }
          bus.emit("drag", payload)
        },
        
      },

      annotation: {
        annotations,
      },
    } as any,
  };

  return options;
};

export default useChart;
