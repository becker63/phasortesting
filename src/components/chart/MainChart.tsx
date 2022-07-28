import React, { useRef } from "react";
import Drag from "./plugins/dragplugin";
import annotationPlugin from "chartjs-plugin-annotation";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";
import useChart from "./chartoptions";
import generatedata from "./generatedata";

ChartJS.register(...registerables);
ChartJS.register(annotationPlugin);
ChartJS.register(Drag);

function MainChart() {
  const constants = {
    maxX: 360,
    minX: 1,

    maxY: 10,
    minY: 0,
  };

  const chartRef = useRef<any | null>(null);

  const options = useChart(chartRef, constants);
  const data = generatedata(constants);

  return (
    <div>
      <Chart
        type="line"
        ref={chartRef}
        style={{ position: "absolute" }}
        options={options}
        data={data}
      />
    </div>
  );
}

export default MainChart;
