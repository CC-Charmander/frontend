import React, { useEffect, useState } from "react";
import "../assets/css/cocktail-detail.css";
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import IconButton from "@mui/material/IconButton";

// テスト用のimport
import cocktailImage from "../assets/images/Cocktail.png";
import { useParams } from "react-router-dom";

// src/routes/Home.js
export const CocktailDetail = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleClick = () => {
    setIsChecked(!isChecked);
  };

  // ↓多分不要になる
  const { cocktailId } = useParams();

  return (
    <>
      <div>
        {/* テスト用に直貼りしてあるが、実際にはObjectから取得する */}
        <img
          src={cocktailImage}
          alt="Cocktail"
          className="detail-cocktail-image"
        />
      </div>

      <div className="cocktail-header">
        <IconButton onClick={handleClick}>
          <FavoriteTwoToneIcon
            sx={{
              color: isChecked ? "#ff3366" : "white",
            }}
          />
        </IconButton>
        <h1 className="detail-cocktail-name">モヒート</h1>
      </div>
      <div className="ingredients">
        <h2>材料</h2>
        <ul>
          <li>ホワイトラム 50ml</li>
          <li>ミントの葉 10枚</li>
          <li>ライムジュース 30ml</li>
          <li>ソーダ水 100ml</li>
          <li>砂糖 1小さじ</li>
        </ul>
      </div>
    </>
  );
};
