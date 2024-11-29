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
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import ingredients from "../assets/data/ingredients_jp_unique.json";
import { useLocation, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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

  const [createdCocktails, setCreatedCocktails] = useState<number[]>([]);

  const navigate = useNavigate();

  //環境変数ファイルよりAPIエンドポイントセット
  // @ts-ignore
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 検索条件をロード
  useEffect(() => {
    const savedIngredients = localStorage.getItem("selectedIngredients");
    if (savedIngredients) {
      setSelectedIngredients(JSON.parse(savedIngredients));
    }
  }, []);

  // 検索条件を保存
  useEffect(() => {
    localStorage.setItem(
      "selectedIngredients",
      JSON.stringify(selectedIngredients)
    );
  }, [selectedIngredients]);

  useEffect(() => {
    const fetchCreationHistory = async () => {
      try {
        type CreationHistory = {
          id: number;
          user_id: number;
          cocktail_id: number;
        };
        const response = await fetch(`${BASE_URL}/creation_history?userId=1`);
        const data = await response.json();
        const creationHistoriesByUserId: CreationHistory[] =
          data.creationHistories;

        setCreatedCocktails(
          creationHistoriesByUserId.map((history) => history.cocktail_id)
        );
      } catch (error) {
        console.error("Failed to fetch creation history:", error);
      }
    };

    const fetchData = async () => {
      try {
        const allRecipes = await axios.get(`${BASE_URL}/recipes`);
        const data = allRecipes.data;

        if (Array.isArray(data)) {
          setCocktails(data);
          setFilteredCocktails(data);
        } else {
          console.error("Expected an array but got:", data);
          setCocktails([]);
          setFilteredCocktails([]);
        }
      } catch (error) {
        console.error("Failed to fetch cocktails data:", error);
        setCocktails([]);
        setFilteredCocktails([]);
      }
    };
    fetchCreationHistory();
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

  const createdCocktailsSet = new Set(createdCocktails);

  //検索したい材料を選択する
  const handleIngredientChange = (event: any, newValue: any) => {
    if (newValue.length <= 3) {
      setSelectedIngredients(newValue);
    }
  };

  const postCocktail = () => {
    navigate("/post");
  };

  // 画像のキャッシュ処理(画像を再リクエストさせないためにローカルストレージに保存)
  const handleImageLoad = (cocktailId: string, imageUrl: string) => {
    localStorage.setItem(`cocktailImage-${cocktailId}`, imageUrl);
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
      <Box sx={{ padding: 2 }}>
        {cocktails === null ? (
          <CircularProgress />
        ) : (
          <>
            <ImageList cols={2} sx={{ marginTop: "84px", width: "100%" }} gap={10}>
              {filteredCocktails !== null && filteredCocktails.length > 0 ? (
                filteredCocktails.map((cocktail) => {
                  // 画像のキャッシュを確認し、localStorageに保存されている画像URLを利用
                  const cachedImage = localStorage.getItem(
                    `cocktailImage-${cocktail.idDrink}`
                  );
                  const imageUrl = cachedImage || cocktail.strDrinkThumb;
                  return (
                    <Card
                      sx={{
                        maxWidth: "100%",
                        opacity: 1,
                        margin: "5px",
                        width: "100%",
                        cursor: "pointer", // ポインタを指カーソルに変更
                        "&:hover": {
                          opacity: 0.8,
                          // ホバー時に視覚効果を追加（任意）
                        },
                      }}
                      key={cocktail.idDrink}
                    >
                      <ImageListItem
                        key={cocktail.idDrink}
                        sx={{
                          width: "45.5vw",
                          cursor: "pointer", // ポインタを指カーソルに変更
                          "&:hover": {
                            opacity: 0.8, // ホバー時に視覚効果を追加（任意）
                          },
                        }}
                        onClick={() =>
                          navigate(`/cocktails/${cocktail.idDrink}`)
                        }
                      >
                        <img
                          // src={cocktail.strDrinkThumb || ""}
                          src={imageUrl}
                          loading="lazy"
                          alt={cocktail.strDrink}
                          style={{
                            borderRadius: "6px",
                            width: "auto",
                            margin: "10px",
                            boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.5)",
                          }}
                          onLoad={() =>
                            handleImageLoad(cocktail.idDrink, imageUrl)
                          }
                        />
                        {createdCocktailsSet.has(
                          parseInt(cocktail.idDrink)
                        ) && (
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "calc(100% - 54px)",
                              display: "flex",
                              alignItems: "flex-end", // 下に揃える
                              justifyContent: "flex-end", // 右に揃える
                              color: "white",
                              fontSize: "2rem",
                              fontWeight: "bold",
                              textShadow: "0 0 5px black",
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              borderRadius: "6px",
                              padding: "10px", // アイコンに余白を追加
                            }}
                          >
                            <CheckCircleIcon />{" "}
                            {/* 必要に応じてアイコンサイズを変更 */}
                          </div>
                        )}
                        <ImageListItemBar
                          title={cocktail.strDrink}
                          position="below"
                          sx={{
                            textAlign: "center", // これでタイトルを中央揃え
                            justifyContent: "center", // さらに、タイトル全体を中央に配置
                            backgroundColor: "rgba(30, 36, 42, 0.8)", // 背景の透明度を少し変更（必要に応じて）
                            color: "white",
                            fontSize: "10px", // タイトルの文字色を変更（必要に応じて）
                          }}
                        />
                      </ImageListItem>
                    </Card>
                  );
                })
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
        color="secondary"
      >
        <AddIcon />
      </Fab>
    </>
  );
};
