import { useEffect } from "react";
import API from "./api/api";

function App() {
  useEffect(() => {
    API.get("/")
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

  return <h1>UPI Expense Tracker Running ✅</h1>;
}

export default App;