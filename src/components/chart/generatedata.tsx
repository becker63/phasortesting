import { ChartData } from "chart.js";


const generatesine = (maxX:number, maxY: number, startx: number, freq: number, amp:number) => {
    const y = []
    for(let i = startx; i < startx + maxX; i++){
        y.push(maxY / 2 + Math.sin(i * freq) * amp)
    }

    return y
  }


const generatedata = (constants: {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}) => {


  const x = Array.from({length: constants.maxX}, (_, i) => i + 1);

  const dataset = [];

  dataset.push({
    label: "1",
    data: generatesine(constants.maxX, constants.maxY, 0, 0.02, 4),
    fill: false,
    borderColor: "rgb(75, 192, 192)",
    tension: 0.1,
  })

  dataset.push({
    label: "2",
    data: generatesine(constants.maxX, constants.maxY, 40, 0.02, 4),
    fill: false,
    borderColor: "rgb(255, 99, 132)",
    tension: 0.1,
  })

  const data: ChartData = { labels: x, datasets: dataset };

  return data;
};

export default generatedata;
