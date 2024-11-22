// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import "./assets/css/common.css";
import { Routes, Route } from "react-router-dom";
import { CocktailDetail } from "./pages/CocktailDetail";
import { Home } from "./pages/Home";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cocktails/:cocktailId" element={<CocktailDetail />} />
        </Routes>
      </ThemeProvider>

      {/* <header>
        <div className="menu-icon">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <div className="search-container">
          <input type="text" id="search-bar" placeholder="材料で検索" />
        </div>
      </header>
      <div>
        <h1>Hello World 2</h1>
      </div> */}
    </>
  );
}

export default App;
