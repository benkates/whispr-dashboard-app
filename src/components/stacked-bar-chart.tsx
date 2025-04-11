import ReactApexChart from "react-apexcharts";
const RATING_NAMES = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];
const FILL_COLORS = ["#79260A", "#F6AE52", "#FFFFE0", "#76C8BE", "#00494C"];
const LABEL_COLORS = ["#fff", "#fff", "#333", "#fff", "#fff"];
const RATINGS = [...Array(5).keys()].map((x) => x + 1);

// @ts-expect-error quick fix
export const StackedBarChart = ({ data, questionId }) => {
  const chartData = RATINGS.map((rating, i) => {
    return {
      name: RATING_NAMES[i],
      color: FILL_COLORS[i],
      data: [
        data.filter(
          (d: { [x: string]: string | number }) => +d[questionId] === rating
        ).length,
      ],
    };
  });

  // config for apex chart
  const CONFIG = {
    series: chartData,
    options: {
      chart: {
        type: "bar",
        stacked: true,
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 10,
        },
      },
      dataLabels: {
        style: {
          colors: LABEL_COLORS,
        },
      },
      xaxis: {
        categories: [""],
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
      },
    },
  };

  return (
    <ReactApexChart
      // @ts-expect-error quick fix
      options={CONFIG.options}
      series={CONFIG.series}
      type="bar"
      height={200}
    />
  );
};
