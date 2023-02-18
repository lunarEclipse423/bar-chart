import { chartData } from "./data.js";

const inCPPromgram = "В программе ЦП";
const inITProgram = "В программе ИТ";
const outOfCPProgram = "Вне программ ЦП";
const outOfITPromram = "Вне программ ИТ";
const months = ["Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь"];

const chart = echarts.init(document.getElementById("main"));
const series = [
  {
    name: inITProgram,
    type: "bar",
    stack: "In",
    data: chartData.filter((el) => el.name === inITProgram).map((el) => el.value),
  },
  {
    name: inCPPromgram,
    type: "bar",
    stack: "In",
    data: chartData.filter((el) => el.name === inCPPromgram).map((el) => el.value),
  },
  {
    name: outOfCPProgram,
    type: "bar",
    stack: "Out",
    data: chartData.filter((el) => el.name === outOfCPProgram).map((el) => el.value),
  },
  {
    name: outOfITPromram,
    type: "bar",
    stack: "Out",
    data: chartData.filter((el) => el.name === outOfITPromram).map((el) => el.value),
  },
];

const seriesHandler = (series) => {
  return series.map((serie, index) => {
    if (index === series.length - 1 || series[index].stack !== series[index + 1].stack) {
      return {
        ...serie,
        label: {
          normal: {
            show: true,
            position: "top",
            formatter: (params) => {
              const serieStack = serie.stack;
              let total = 0;
              series.forEach((s) => {
                if (s.stack === serieStack) {
                  total += s.data[params.dataIndex];
                }
              });
              return total;
            },
            textStyle: {
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: "600",
              fontSize: "14px",
              color: "#002033",
            },
          },
        },
      };
    } else {
      return {
        ...serie,
        label: undefined,
      };
    }
  });
};

const handleLegendSelectChanged = (event, series) => {
  const includedSeriesNames = [];
  for (const [name, value] of Object.entries(event.selected)) {
    if (value) {
      includedSeriesNames.push(name);
    }
  }

  const includedSeries = series.filter((serie) => {
    return includedSeriesNames.includes(serie.name);
  });

  return seriesHandler(includedSeries);
};

const options = {
  color: ["#56B9F2", "#0078D2", "#00724C", "#22C38E"],
  tooltip: {
    trigger: "axis",
    formatter: function (params) {
      const month = params[0].name;
      const cp = params.find((el) => el.seriesName === inCPPromgram) || null;
      const it = params.find((el) => el.seriesName === inITProgram) || null;
      const outOfCP = params.find((el) => el.seriesName === outOfCPProgram) || null;
      const outOfIT = params.find((el) => el.seriesName === outOfITPromram) || null;
      const sumIn = (cp === null ? 0 : cp.value) + (it === null ? 0 : it.value);
      const sumOut =
        (outOfCP === null ? 0 : outOfCP.value) + (outOfIT === null ? 0 : outOfIT.value);
      const percentageIn = Math.ceil((sumIn * 100) / (sumIn + sumOut));
      const percentageOut = 100 - percentageIn;

      return [
        `<h3>${month} 2023</h3>`,
        `<h3 class="program-title"><span>В программе</span> <span>${percentageIn}% | ${sumIn} шт.</span></h3>`,
        cp !== null
          ? `<div class=value-wrapper><span class=value-title>${cp.marker} ${cp.seriesName}</span> <span class=value>${cp.value} шт.</span></div>`
          : "",
        it !== null
          ? `<div class=value-wrapper><span class=value-title>${it.marker} ${it.seriesName}</span> <span class=value> ${it.value} шт.</span></div>`
          : "",
        `<h3 class="program-title"><span>Вне программ</span> <span>${percentageOut}% | ${sumOut} шт.</span></h3>`,
        outOfCP !== null
          ? `<div class=value-wrapper><span class=value-title>${outOfCP.marker} ${outOfCP.seriesName}</span> <span class=value>${outOfCP.value} шт.</span></div>`
          : "",
        outOfIT !== null
          ? `<div class=value-wrapper><span class=value-title>${outOfIT.marker} ${outOfIT.seriesName}</span> <span class=value> ${outOfIT.value} шт.</span></div>`
          : "",
      ].join("");
    },
    textStyle: {
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: "12px",
      color: "#002033",
    },
    extraCssText: "min-width: 190px",
  },
  legend: {
    data: [inCPPromgram, inITProgram, outOfCPProgram, outOfITPromram],
    orient: "horizontal",
    left: 80,
    bottom: 0,
    textStyle: {
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: "12px",
      color: "rgba(0, 32, 51, 0.6)",
    },
    icon: "circle",
  },
  xAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    splitNumber: months.length,
    data: months,
  },
  yAxis: {
    axisLine: { show: true },
    axisTick: { show: true },
    min: 0,
    splitLine: {
      lineStyle: {
        type: "dashed",
      },
    },
    splitNumber: 9,
  },
};

chart.setOption({
  ...options,
  series: seriesHandler(series),
});

chart.on("legendselectchanged", (event) => {
  chart.setOption({
    series: handleLegendSelectChanged(event, series),
  });
});
