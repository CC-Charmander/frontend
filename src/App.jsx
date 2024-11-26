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
    background: {
      default: "#181F27", // 全体の背景色
      paper: "#181F27", // headerおよび材料とバーテンダーコメントの箇所
    },
    // text: {
    //   primary: "#ecf0f1",  // 全ての文字色
    // },
  },
  typography: {
    // fontFamily: "Lobster", // 比較的普通のフォント
    // fontFamily: "'Montserrat', sans-serif",
    // fontFamily: "'Open Sans', sans-serif",
    // fontFamily: "'Merriweather', serif",
    // fontFamily: "Verdana, Noto Sans JP", // 候補
    // fontFamily: "Avenir",
    // fontFamily: "Georgia",
    // fontFamily: "Tsukimi Rounded, sans-serif", // 細文字
    // fontFamily: "Kaisei Tokumin, serif",
    // fontFamily: "Zen Kurenaido, sans-serif",
    // fontFamily: "Shippori Mincho B1, serif", // 候補
    // fontFamily: "Kosugi Maru, sans-serif", // 丸い
    // fontFamily: "BIZ UDGothic, sans-serif", // ない
    // fontFamily: "Zen Old Mincho, serif", // 
    fontFamily: "Noto Sans JP, sans-serif",
    // fontFamily: "Sawarabi Gothic, sans-serif",

    // fontFamily: "'Roboto Mono', monospace",
    // fontFamily: "'Playfair Display', serif", // 超フォーマルなフォント
    // fontFamily: "'Dancing Script', cursive, 'Kosugi Maru'", // 手書き風のフォント
    // fontFamily: "'Roboto', sans-serif", // ゴシックに近い？
    // fontFamily: "'Poppins', sans-serif", // Robotoの文字サイズを少し大きくした感じ
    // fontFamily: "'Noto Sans JP', sans-serif",
    // fontFamily: "'M PLUS 1p', sans-serif",
    // fontFamily: "'Kosugi Maru', sans-serif",
    // fontFamily: "'Dancing Script', cursive", // 手書き風のフォント
  }
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
