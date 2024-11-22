import { useEffect, useState } from "react";
import "../assets/css/cocktail-detail.css";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import IconButton from "@mui/material/IconButton";

// テスト用のimport
// import cocktailImage from "../assets/images/Cocktail.png";
import { useParams } from "react-router-dom";

// src/routes/Home.js
export const CocktailDetail = () => {
  const [cocktails, setCocktails] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const handleClick = () => {
    setIsChecked(!isChecked);
  };

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

  // ↓多分不要になる
  const { cocktailId } = useParams();

  const cocktail = cocktails.filter((cocktail) => cocktail.idDrink === cocktailId);

  return (
    <>
      {cocktail.length === 0 ? (
        <p style={{ marginLeft: "30px" }}>対応するカクテルはありません。</p>
      ) : (
        <>
          <div>
            {/* テスト用に直貼りしてあるが、実際にはObjectから取得する */}
            <img src={cocktail[0].strDrinkThumb} alt="Cocktail" className="detail-cocktail-image" />
          </div>

          <div className="cocktail-header">
            <IconButton onClick={handleClick}>
              <FavoriteTwoToneIcon
                sx={{
                  color: isChecked ? "#ff3366" : "white",
                }}
              />
            </IconButton>
            <h1 className="detail-cocktail-name">{cocktail[0].strDrink}</h1>
          </div>
          <div className="ingredients">
            <h2>材料</h2>
            <ul>
              {cocktail[0].ingredients.map((ing, i) => (
                <li key={ing}>
                  {ing} {cocktail[0].measures[i]}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};
