// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import "./assets/css/common.css";
import { Routes, Route } from "react-router-dom";
import { CocktailDetail } from "./pages/CocktailDetail";
import { Home } from "./pages/Home";
import { PostCocktail } from "./pages/PostCocktail";
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
          <Route path="/post" element={<PostCocktail />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
