import { BrowserRouter } from "react-router-dom";
import AppRoutes from "../app/routes";

import "../styles/variables.css";
import "../styles/global.css";
import "../styles/auth.css";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
