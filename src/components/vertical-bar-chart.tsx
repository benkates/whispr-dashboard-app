// @ts-nocheck
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import { MultiSelect } from "@/components/ui/combobox-multi";

const FILL_COLOR = "#2D3648";

// @ts-expect-error quick fix
export const VerticalBarChart = ({ data, questionId }) => {
  const [selectedSentiment, setSelectedSentiment] = useState<string[]>([]);
  const [filteredConfig, setFilteredConfig] = useState<object>({});

  useEffect(() => {
    // FUTURE ENHANCEMENT: remove stop words
    // split words
    const chartData = data
      .filter((d) =>
        selectedSentiment.length > 0
          ? selectedSentiment.includes(d.sentiment_label)
          : true
      )
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

    setFilteredConfig({
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
    });
  }, [selectedSentiment, data, questionId]);

  return (
    <>
      <div className="w-[400px]">
        <MultiSelect
          options={[
            { value: "Positive", label: "Positive" },
            { value: "Neutral", label: "Neutral" },
            { value: "Negative", label: "Negative" },
          ]}
          selected={selectedSentiment}
          onChange={setSelectedSentiment}
          placeholder="Select sentiment tag(s)..."
          emptyText="No selection found."
        />
      </div>
      {filteredConfig.options && filteredConfig.series && (
        <ReactApexChart
          options={filteredConfig.options}
          series={filteredConfig.series}
          type="bar"
          height={500}
        />
      )}
    </>
  );
};
