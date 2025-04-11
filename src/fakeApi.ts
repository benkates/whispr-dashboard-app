// @ts-nocheck
// FUTURE ENHANCEMENT: add more types
import { parse } from "papaparse";

// GH Copilot assisted with the duplicate flag function for dev speed ⬇️
interface SentenceObject {
  q3_open: string;
  has_duplicate_string?: boolean; // Optional key to indicate duplicates
}

const addDuplicateFlag = (arr: SentenceObject[]): SentenceObject[] => {
  // Create a map to count occurrences of each sentence
  const sentenceCount: Record<string, number> = {};

  // Count each sentence
  arr.forEach((obj) => {
    const sentence = obj.q3_open; // Access the sentence
    sentenceCount[sentence] = (sentenceCount[sentence] || 0) + 1;
  });

  // Add the boolean key based on the count
  return arr.map((obj) => {
    const sentence = obj.q3_open;
    return {
      ...obj,
      has_duplicate_string: sentenceCount[sentence] > 1 ? "yes" : "no", // true if there is a duplicate
    };
  });
};

// main fetch data function: fetch csv data from public folder
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
          resolve(addDuplicateFlag(resultsAgeGrouped));
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

// fetch data based on filters (exposed to App.tsx)
export const fetchSurveyResponses = (filters) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const data = await fetchData();
      // filter source data based on any filters
      const filteredData = data.filter((response) => {
        if (filters) {
          // bot detection filter
          const matchesBotDetection =
            filters.botDetection && filters.botDetection.length > 0
              ? filters.botDetection.includes(response.has_duplicate_string)
              : true;
          // age filter
          const matchesAgeGroup =
            filters.ageGroup && filters.ageGroup.length > 0
              ? filters.ageGroup.includes(response.age_group)
              : true;
          // geo state filter
          const matchesGeoState =
            filters.geoState && filters.geoState.length > 0
              ? filters.geoState.includes(response.state)
              : true;
          // gender filter
          const matchesGender =
            filters.gender && filters.gender.length > 0
              ? filters.gender.includes(response.gender)
              : true;
          // education level filter
          const matchesEducationLevel =
            filters.educationLevel && filters.educationLevel.length > 0
              ? filters.educationLevel.includes(response.education_level)
              : true;

          // return matches
          return (
            matchesBotDetection &&
            matchesAgeGroup &&
            matchesGeoState &&
            matchesGender &&
            matchesEducationLevel
          );
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
