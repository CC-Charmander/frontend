import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Fab,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Paper,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import ingredients from "../assets/data/ingredients_jp_unique.json";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

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
  const [selectedIngredients, setSelectedIngredients] = useState([]); //検索したい材料
  const [filteredCocktails, setFilteredCocktails] = useState<Cocktail[] | null>(
    null
  ); //検索結果
  const [searchValue, setSearchValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  //環境変数ファイルよりAPIエンドポイントセット
  // const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const BASE_URL = "http://cocktify.us-east-1.elasticbeanstalk.com"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allRecipes = await axios.get(`${BASE_URL}/recipes`);
        const data = allRecipes.data;
        if (Array.isArray(data)) {
          setCocktails(data); // 配列ならそのまま設定
          setFilteredCocktails(data); //初期状態では全てのレシピをセットしておく
        } else {
          console.error("Expected an array but got:", data);
          setCocktails([]); // 不正なデータの場合は空配列
          setFilteredCocktails([]); // 不正なデータの場合は空配列
        }
      } catch (error) {
        console.error("Failed to fetch cocktails data:", error);
        setCocktails([]); // フェッチ失敗時も空配列
        setFilteredCocktails([]); // フェッチ失敗時も空配列
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // 選択された材料に基づいて絞り込み
    if (cocktails) {
      const filtered = cocktails.filter((cocktail) =>
        selectedIngredients.every((ingredient) =>
          cocktail.ingredients.includes(ingredient)
        )
      );
      setFilteredCocktails(filtered);
    }
  }, [selectedIngredients, cocktails]);

  const search = () => {
    if (!ingredients.includes(inputValue)) {
      setError("検索したいベースのお酒が見つかりません");
      return;
    }
    setError(null);
    setSearchValue(inputValue);
  };

  //検索したい材料を選択する
  const handleIngredientChange = (event, newValue) => {
    if (newValue.length <= 3) {
      setSelectedIngredients(newValue);
    }
  };

  const postCocktail = () => {
    navigate("/post");
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
          <Autocomplete
            multiple
            id="ingredients-autocomplete"
            options={ingredients}
            forcePopupIcon={false} //ドロップダウンのアイコンを消す
            disableClearable={true} //テキスト入力欄のクリアボタンを消す
            value={selectedIngredients}
            onChange={handleIngredientChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="材料を選択（最大3つ）"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={option}
                    {...tagProps}
                    style={{ margin: "2px" }}
                  />
                );
              })
            }
            sx={{ width: "100%" }}
          />

          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={search}
          >
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
              {filteredCocktails.length > 0 ? (
                filteredCocktails.map((cocktail) => (
                  <ImageListItem
                    key={cocktail.idDrink}
                    sx={{
                      width: "45.5vw",
                      cursor: "pointer", // ポインタを指カーソルに変更
                      "&:hover": {
                        opacity: 0.8, // ホバー時に視覚効果を追加（任意）
                      },
                    }}
                    onClick={() => navigate(`/cocktails/${cocktail.idDrink}`)}
                  >
                    <img
                      src={cocktail.strDrinkThumb || ""}
                      loading="lazy"
                      alt={cocktail.strDrink}
                      style={{ borderRadius: "6px", width: "45.5vw" }}
                    />
                    <ImageListItemBar
                      title={cocktail.strDrink}
                      subtitle="ポエポエポエム"
                      position="below"
                    />
                  </ImageListItem>
                ))
              ) : (
                <p>カクテルが見つかりません。</p>
              )}
            </ImageList>
          </>
        )}
      </Box>
      <Fab
        sx={{
          position: "fixed", // 画面全体を基準に固定
          bottom: 24,
          right: 24,
          zIndex: 1200, // 必要に応じて、他のコンテンツより上に配置
        }}
        onClick={postCocktail}
      >
        <AddIcon />
      </Fab>
    </>
  );
};
