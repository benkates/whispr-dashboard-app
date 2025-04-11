import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import "./App.css";
import { fetchSurveyResponses } from "./fakeApi";

function App() {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const loadInitData = async () => {
      // get survey responses
      const initialResponses = await fetchSurveyResponses();
      setResponses(initialResponses);
    };
    loadInitData();
  }, []);

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
                <CardContent></CardContent>
              </Card>
              {/* GENDER FILTER CARD */}
              <Card className="@container/card">
                <CardHeader className="relative">
                  <CardTitle className="@[250px]/card:text-xl text-xl font-semibold tabular-nums">
                    Gender Filter
                  </CardTitle>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </div>
            <div className="px-4 lg:px-6">
              {responses.length > 0 && (
                <Card className="w-full p-4">
                  {JSON.stringify(responses)}
                  <h2>Question 2</h2>
                  <hr />
                  <h3>Question 3</h3>
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
