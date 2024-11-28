import { useEffect, useState } from "react";
import "../assets/css/cocktail-detail.css";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

import { useParams } from "react-router-dom";
import { AppBar, Box, Paper, Toolbar, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

//環境変数ファイルよりAPIエンドポイントセット
const BASE_URL = "http://cocktify.us-east-1.elasticbeanstalk.com"
// const REC_BASE_URL = import.meta.env.VITE_REC_API_BASE_URL;

// src/routes/Home.js
export const CocktailDetail = () => {
  const [cocktails, setCocktails] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [aiComments, setAiComments] = useState(null);

  const navigate = useNavigate();

  const handleClick = async () => {
    setIsChecked(!isChecked);
    try {
      const getRes = await axios.get(`${BASE_URL}/creation_history`, {
        params: {
          cocktailId: cocktailId,
          userId: 1,
        },
      });
      if (getRes.data.exists === 0) {
        // DBにデータが無かった場合 → データ登録
        const postRes = await axios.post(`${BASE_URL}/creation_history`, {
          user_id: 1,
          cocktail_id: cocktailId,
        });
      } else {
        // DBにデータが有った場合 → データ削除
        const deleteRes = await axios.delete(`${BASE_URL}/creation_history`, {
          params: {
            cocktail_id: cocktailId,
            user_id: 1,
          },
        });
      }
    } catch (err) {
      console.error("creation history 関連でエラーが発生", err);
    }
  };

  const getAiComment = async (cocktail) => {
    try {
      if (cocktail.length !== 0) {
        const reqData = JSON.stringify(cocktail[0].ingredients)

        console.log(reqData)

        // flaskの/api/testを叩くコード
        // const getTestRes = await axios.get(`https://jlz4scm3x1.execute-api.us-east-1.amazonaws.com/dev/test`);
        // console.log(getTestRes.data)

        // flaskの/api/snackを叩くコード（引数無し）
        // const getSnackRes = await axios.get(`https://jlz4scm3x1.execute-api.us-east-1.amazonaws.com/dev/api/snack/test`);
        // console.log(getSnackRes.data)

        // ↓引数ありバージョン
        const getRes = await axios.get(`https://jlz4scm3x1.execute-api.us-east-1.amazonaws.com/dev/api/snack`, {
          params: {
            ingredients: reqData,
          },
        });
        console.log(getRes.data)

        // ↓バーテンダーコメントをセット
        // setAiComments(getSnackRes.data)
    
        // console.log(getSnackRes.data)
      }
    } catch (err) {
      console.log(err.response.status)
      if(err.response.status === 500) {
        console.log("status500のエラーのため再送")
        // await getAiComment(cocktail);
      } else {
        console.error("setAiComment 関連でエラーが発生", err);
      }
    }
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

  useEffect(() => {
    const initialData = async () => {
      try {
        const getRes = await axios.get(`${BASE_URL}/creation_history`, {
          params: {
            cocktailId: cocktailId,
            userId: 1,
          },
        });
        if (getRes.data.exists === 0) {
          // DBにデータが無かった場合 → データ登録
          setIsChecked(false);
        } else {
          // DBにデータが有った場合 → データ削除
          setIsChecked(true);
        }
      } catch (err) {
        console.error("creation history 関連でエラーが発生", err);
      }
    };
    initialData();
  }, []);

  const { cocktailId } = useParams();

  const cocktail = cocktails.filter((cocktail) => cocktail.idDrink === cocktailId);

  useEffect(() => {
    if (cocktail.length > 0) {
      getAiComment(cocktail);
    }
  }, [cocktails])

  return (
    <>
      {cocktail.length === 0 ? (
        <p style={{ marginLeft: "30px" }}>対応するカクテルはありません。</p>
      ) : (
        <div>
          <AppBar
            sx={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "100%",
              zIndex: 1200, // 必要に応じて調整 (AppBarなどと重ならないように)
            }}
          >
            <Toolbar sx={{ width: "100%" }}>
              <IconButton onClick={() => navigate("/")}>
                <ArrowBackIcon />
              </IconButton>
              <Box flexGrow={1} textAlign="center" marginRight="56px">
                <Typography>
                  {/* {cocktail[0].strDrink} */}
                  カクテルの詳細
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
          <Box padding={2} marginTop={10}>
            <div>
              {/* テスト用に直貼りしてあるが、実際にはObjectから取得する */}
              <img
                src={cocktail[0].strDrinkThumb}
                alt="Cocktail"
                className="detail-cocktail-image"
                style={{ borderRadius: "8px" }}
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
              <h1 className="detail-cocktail-name">{cocktail[0].strDrink}</h1>
            </div>
            <Paper sx={{ borderRadius: "16px", padding: "14px", marginTop: 4 }}>
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
            </Paper>
            <Paper sx={{ borderRadius: "16px", padding: "14px", marginTop: 2 }}>
              <div className="ingredients">
                <h2>バーテンダーから一言</h2>
                {aiComments === null ? (
                  <p>考え中です・・・</p>
                ) : (
                  <p>{aiComments}</p>
                )}
              </div>
            </Paper>
          </Box>
        </div>
      )}
    </>
  );
};
