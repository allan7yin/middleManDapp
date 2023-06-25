import ResponsiveAppBar from "./AppBar";
import TransactionLanding from "./TransactionLanding";
import { BrowserRouter,Route, Routes } from "react-router-dom";

function App() {
  return (
        <div className="App" style={{ height: "100vh", width: "100vw" }}>
          <ResponsiveAppBar/>
          <BrowserRouter>
            <Routes>
              <Route path="/hash/:id" element={<TransactionLanding />} />
            </Routes>
          </BrowserRouter>
        </div>
  );
}

export default App;
