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

type RawCocktail = {
  [key: string]: any;
}[];

type Cocktail = {
  idDrink: string;
  strAlcoholic: string;
  strCategory: string;
  strCreativeCommonsConfirmed: string | null;
  strDrink: string;
  strDrinkThumb: string | null;
  strGlass: string | null;
  strImageSource: string | null;
  strIngredient1: string | null;
  strIngredient2: string | null;
  strIngredient3: string | null;
  strIngredient4: string | null;
  strIngredient5: string | null;
  strIngredient6: string | null;
  strIngredient7: string | null;
  strIngredient8: string | null;
  strIngredient9: string | null;
  strIngredient10: string | null;
  strIngredient11: string | null;
  strIngredient12: string | null;
  strIngredient13: string | null;
  strIngredient14: string | null;
  strIngredient15: string | null;
  strInstructions: string | null;
  strMeasure1: string | null;
  strMeasure2: string | null;
  strMeasure3: string | null;
  strMeasure4: string | null;
  strMeasure5: string | null;
  strMeasure6: string | null;
  strMeasure7: string | null;
  strMeasure8: string | null;
  strMeasure9: string | null;
  strMeasure10: string | null;
  strMeasure11: string | null;
  strMeasure12: string | null;
  strMeasure13: string | null;
  strMeasure14: string | null;
  strMeasure15: string | null;
};

function transformToCocktail(rawData: any): Cocktail {
  return {
    idDrink: rawData.idDrink,
    strAlcoholic: rawData.strAlcoholic,
    strCategory: rawData.strCategory,
    strCreativeCommonsConfirmed: rawData.strCreativeCommonsConfirmed ?? null,
    strDrink: rawData.strDrink,
    strDrinkThumb: rawData.strDrinkThumb ?? null,
    strGlass: rawData.strGlass ?? null,
    strImageSource: rawData.strImageSource ?? null,
    strIngredient1: rawData.strIngredient1 ?? null,
    strIngredient2: rawData.strIngredient2 ?? null,
    strIngredient3: rawData.strIngredient3 ?? null,
    strIngredient4: rawData.strIngredient4 ?? null,
    strIngredient5: rawData.strIngredient5 ?? null,
    strIngredient6: rawData.strIngredient6 ?? null,
    strIngredient7: rawData.strIngredient7 ?? null,
    strIngredient8: rawData.strIngredient8 ?? null,
    strIngredient9: rawData.strIngredient9 ?? null,
    strIngredient10: rawData.strIngredient10 ?? null,
    strIngredient11: rawData.strIngredient11 ?? null,
    strIngredient12: rawData.strIngredient12 ?? null,
    strIngredient13: rawData.strIngredient13 ?? null,
    strIngredient14: rawData.strIngredient14 ?? null,
    strIngredient15: rawData.strIngredient15 ?? null,
    strInstructions: rawData.strInstructions ?? null,
    strMeasure1: rawData.strMeasure1 ?? null,
    strMeasure2: rawData.strMeasure2 ?? null,
    strMeasure3: rawData.strMeasure3 ?? null,
    strMeasure4: rawData.strMeasure4 ?? null,
    strMeasure5: rawData.strMeasure5 ?? null,
    strMeasure6: rawData.strMeasure6 ?? null,
    strMeasure7: rawData.strMeasure7 ?? null,
    strMeasure8: rawData.strMeasure8 ?? null,
    strMeasure9: rawData.strMeasure9 ?? null,
    strMeasure10: rawData.strMeasure10 ?? null,
    strMeasure11: rawData.strMeasure11 ?? null,
    strMeasure12: rawData.strMeasure12 ?? null,
    strMeasure13: rawData.strMeasure13 ?? null,
    strMeasure14: rawData.strMeasure14 ?? null,
    strMeasure15: rawData.strMeasure15 ?? null,
  };
}

export const Home = () => {
  const [cocktails, setCocktails] = useState<Cocktail[]>();
  useEffect(() => {
    const fetchData = async () => {
      const data = await import("../assets/data/cocktails_filtered.json");
      setCocktails((data.cocktails as RawCocktail).map((drink) => transformToCocktail(drink)));
    };
    fetchData();
  }, []);

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
            width: "100%", // headerに合わせる
          }}
        >
          <IconButton sx={{ p: "10px" }} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Autocomplete
            options={ingredients}
            sx={{ flex: 1 }}
            renderInput={(params) => <TextField {...params} placeholder="ベースのお酒で検索" variant="standard" />}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </header>
      <Box sx={{ width: "100vw", padding: 2 }}>
        {cocktails === undefined ? (
          <CircularProgress />
        ) : (
          <>
            <ImageList cols={2} sx={{ marginTop: "64px" }}>
              {cocktails.map((cocktail) => (
                <ImageListItem key={cocktail.idDrink} sx={{ width: "45.5vw" }}>
                  <img
                    src={cocktail.strDrinkThumb || ""}
                    loading="lazy"
                    alt={cocktail.strDrink}
                    style={{ borderRadius: "6px", width: "45.5vw" }}
                  />
                  <ImageListItemBar title={cocktail.strDrink} subtitle="ポエポエポエム" position="below" />
                </ImageListItem>
              ))}
            </ImageList>
          </>
        )}
      </Box>
    </>
  );
};
