// @ts-nocheck
// FUTURE ENHANCEMENT: add more types
import { parse } from "papaparse";

const fetchData = async () => {
  try {
    const response = await fetch("/data/us_ai_survey_unique_50.csv");
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const csvData = await response.text();
    return new Promise((resolve, reject) => {
      parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const initResults = results.data;
          // add "age group bucket" from instructions
          // FUTURE ENHANCEMENT: more industry standard age groupings
          const resultsAgeGrouped = initResults.map((d) => {
            d.age_group = Math.floor(+d.age / 10) * 10;
            d.age_group = `${d.age_group}-${d.age_group + 9}`;
            return d;
          });
          resolve(resultsAgeGrouped);
        },
        error: (error: unknown) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error("Error fetching the CSV file:", error);
    throw error;
  }
};

export const fetchSurveyResponses = (filters) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const data = await fetchData();
      // filter source data based on any filters
      const filteredData = data.filter((response) => {
        if (filters) {
          // age filter
          const matchesAgeGroup =
            filters.ageGroup && filters.ageGroup.length > 0
              ? filters.ageGroup.includes(response.age_group)
              : true;
          // gender filter
          const matchesGender =
            filters.gender && filters.gender.length > 0
              ? filters.gender.includes(response.gender)
              : true;
          // return matches
          return matchesAgeGroup && matchesGender;
        } else {
          return true;
        }
      });
      resolve(filteredData);
    }, 250); // simulate network delay
  });
};

// get unique values for filters
export const getUniqueValues = (field: string) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const data = await fetchData();
      const uniqueValues = [...new Set(data.map((item) => item[field]))];
      resolve(uniqueValues);
    }, 250); // simulate network delay
  });
};
