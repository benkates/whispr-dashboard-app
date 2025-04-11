// @ts-nocheck
import ReactApexChart from "react-apexcharts";
const FILL_COLOR = "#2D3648";

// @ts-expect-error quick fix
export const VerticalBarChart = ({ data, questionId }) => {
  // FUTURE ENHANCEMENT: remove stop words
  // split words
  const chartData = data
    .map((d) => {
      return {
        data: d[questionId].split(" ").map((w) => w.toLowerCase()),
      };
    })
    // pull out the array, flatten and reduce to a new object with word/count
    .map((d) => d.data)
    .flat()
    // GH Copilot assist for word/count object ⬇️
    .reduce((acc, word) => {
      // Find if the word already exists in the accumulator
      const existing = acc.find((item) => item.word === word);

      if (existing) {
        // If it exists, increment the count
        existing.count += 1;
      } else {
        // If it doesn't exist, add a new object with count 1
        acc.push({ word: word, count: 1 });
      }

      return acc;
    }, [])
    // sort descending top 10
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const CONFIG = {
    series: [{ data: chartData.map((d) => d.count) }],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      fill: {
        colors: [FILL_COLOR],
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          horizontal: true,
        },
      },
      xaxis: {
        categories: chartData.map((d) => d.word),
      },
    },
  };

  return (
    <>
      <ReactApexChart
        options={CONFIG.options}
        series={CONFIG.series}
        type="bar"
        height={500}
      />
    </>
  );
};
