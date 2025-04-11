import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import "./App.css";
import { fetchSurveyResponses, getUniqueValues } from "./fakeApi";
import { MultiSelect } from "@/components/ui/combobox-multi";
import { StackedBarChart } from "./components/stacked-bar-chart";
import { VerticalBarChart } from "./components/vertical-bar-chart";

const INIT_OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

function App() {
  const [responses, setResponses] = useState([]);

  // FUTURE ENHANCEMENT: replace basic state management with redux toolkit
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string[]>([]);
  const [selectedAgeGroupOptions, setSelectedAgeGroupOptions] =
    useState<object[]>(INIT_OPTIONS);

  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [genderFilterOptions, setGenderFilterOptions] =
    useState<object[]>(INIT_OPTIONS);

  useEffect(() => {
    const loadInitData = async () => {
      // set age group filter unique values (sort alpha)
      const ageGroupInit = await getUniqueValues("age_group");
      setSelectedAgeGroupOptions(
        ageGroupInit
          .map((d) => {
            return {
              value: d,
              label: d,
            };
          })
          .sort((a, b) => a.value.localeCompare(b.value))
      );

      // set gender filter unique values (sort alpha)
      const genderInit = await getUniqueValues("gender");
      setGenderFilterOptions(
        genderInit
          .map((d) => {
            return {
              value: d,
              label: d,
            };
          })
          .sort((a, b) => a.value.localeCompare(b.value))
      );

      // get survey responses
      const initialResponses = await fetchSurveyResponses();
      setResponses(initialResponses);
    };
    loadInitData();
  }, []);

  // filter survey responses based on selected filters (in dependency array)
  useEffect(() => {
    const loadFilteredData = async () => {
      const filteredResponses = await fetchSurveyResponses({
        gender: selectedGender,
        ageGroup: selectedAgeGroup,
      });
      setResponses(filteredResponses);
    };

    loadFilteredData();
  }, [selectedGender, selectedAgeGroup]);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* parent styles lifted from shadcn/ui Dashboard block example https://ui.shadcn.com/blocks */}
            {/* FUTURE ENHANCEMENT: only show filters once source api data has loaded */}
            <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
              {/* AGE FILTER CARD */}
              <Card className="@container/card">
                <CardHeader className="relative">
                  <CardTitle className="@[250px]/card:text-xl text-xl font-semibold tabular-nums">
                    Age Group Filter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MultiSelect
                    // @ts-expect-error quick fix
                    options={selectedAgeGroupOptions}
                    selected={selectedAgeGroup}
                    onChange={setSelectedAgeGroup}
                    placeholder="Select age group..."
                    emptyText="No selection found."
                  />
                </CardContent>
              </Card>
              {/* GENDER FILTER CARD */}
              <Card className="@container/card">
                <CardHeader className="relative">
                  <CardTitle className="@[250px]/card:text-xl text-xl font-semibold tabular-nums">
                    Gender Filter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MultiSelect
                    // @ts-expect-error quick fix
                    options={genderFilterOptions}
                    selected={selectedGender}
                    onChange={setSelectedGender}
                    placeholder="Select gender..."
                    emptyText="No selection found."
                  />
                </CardContent>
              </Card>
            </div>
            <div className="px-4 lg:px-6">
              {responses.length > 0 && (
                <Card className="w-full p-4">
                  <h2>Question 2</h2>
                  <StackedBarChart data={responses} questionId="q2_rating" />
                  <hr />
                  <h3>Question 3</h3>
                  <VerticalBarChart data={responses} questionId="q3_open" />
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
