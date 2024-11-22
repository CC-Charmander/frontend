import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Paper,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import ingredients from "../assets/data/ingredients_jp_unique.json";

export type Cocktail = {
  idDrink: string;
  strDrink: string;
  strTags: string | null;
  strCategory: string;
  strAlcoholic: string;
  strGlass: string;
  strInstructions: string;
  strDrinkThumb: string | null;
  strCreativeCommonsConfirmed: string | null;
  dateModified: string | null;
  ingredients: string[]; // 配列型で材料を定義
  measures: string[]; // 配列型で分量を定義
};
export const Home = () => {
  const [cocktails, setCocktails] = useState<Cocktail[] | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const module = await import("../assets/data/cocktails_jp.json");
        const data = module.default;
        if (Array.isArray(data)) {
          setCocktails(data); // 配列ならそのまま設定
        } else {
          console.error("Expected an array but got:", data);
          setCocktails([]); // 不正なデータの場合は空配列
        }
      } catch (error) {
        console.error("Failed to fetch cocktails data:", error);
        setCocktails([]); // フェッチ失敗時も空配列
      }
    };
    fetchData();
  }, []);

  const search = () => {
    if (!ingredients.includes(inputValue)) {
      setError("検索したいベースのお酒が見つかりません");
      return;
    }
    setError(null);
    setSearchValue(inputValue);
  };

  return (
    <>
      <header
        className="glass"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1200,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          WebkitBackdropFilter: "blur(20px)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <IconButton sx={{ p: "10px" }} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Autocomplete
            onInputChange={(event, newValue) => {
              setInputValue(newValue);
              setError(null);
            }}
            options={ingredients}
            sx={{ flex: 1 }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="ベースのお酒で検索"
                variant="standard"
                error={!!error}
                helperText={error}
              />
            )}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search" onClick={search}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </header>
      <Box sx={{ width: "100vw", padding: 2 }}>
        {cocktails === null ? (
          <CircularProgress />
        ) : (
          <>
            <ImageList cols={2} sx={{ marginTop: "64px" }}>
              {cocktails.length > 0 ? (
                cocktails
                  .filter((cocktail) => {
                    if (searchValue === "") {
                      return true;
                    }
                    return cocktail.ingredients.includes(searchValue);
                  })
                  .map((cocktail) => (
                    <ImageListItem key={cocktail.idDrink} sx={{ width: "45.5vw" }}>
                      <img
                        src={cocktail.strDrinkThumb || ""}
                        loading="lazy"
                        alt={cocktail.strDrink}
                        style={{ borderRadius: "6px", width: "45.5vw" }}
                      />
                      <ImageListItemBar title={cocktail.strDrink} subtitle="ポエポエポエム" position="below" />
                    </ImageListItem>
                  ))
              ) : (
                <p>カクテルが見つかりません。</p>
              )}
            </ImageList>
          </>
        )}
      </Box>
    </>
  );
};
