import { useEffect, useState } from "react";
import "../assets/css/cocktail-detail.css";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import axios from "axios";

import { useParams } from "react-router-dom";
import { AppBar, Box, Paper, Toolbar, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

//環境変数ファイルよりAPIエンドポイントセット
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const REC_BASE_URL = import.meta.env.VITE_REC_API_BASE_URL;

// src/routes/Home.js
export const CocktailDetail = () => {
  const [cocktails, setCocktails] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0); // いいねの数を管理
  const [showHeart, setShowHeart] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);
  const LONG_PRESS_THRESHOLD = 500; // 500ミリ秒

  const [aiComments, setAiComments] = useState(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const navigate = useNavigate();

  const { cocktailId } = useParams();

  const cocktail = cocktails;

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

  const handleLikeButtonClick = async () => {
    try {
      const getRes = await axios.get(`${BASE_URL}/favorites`, {
        params: {
          cocktailId: cocktailId,
          userId: 1,
        },
      });
      if (getRes.data.exists === 0) {
        // DBにデータが無かった場合 → データ登録
        const postRes = await axios.post(`${BASE_URL}/favorites`, {
          userId: 1,
          cocktailId: parseInt(cocktailId),
        });
        setIsLiked(true);
        setLikeCount((prev) => prev + 1); // いいね数を増加
      } else {
        // DBにデータが有った場合 → データ削除
        const deleteRes = await axios.delete(`${BASE_URL}/favorites`, {
          params: {
            cocktailId: cocktailId,
            userId: 1,
          },
        });
        setIsLiked(false);
        setLikeCount((prev) => prev - 1); // いいね数を減少
      }
    } catch (err) {
      console.error("favorites関連でエラーが発生", err);
    }
  };

  // ♡マークを表示するための関数
  const handleLongPressStart = () => {
    setPressTimer(
      setTimeout(() => {
        setShowHeart(true);
        handleLikeButtonClick(); // Like登録を行う
        setTimeout(() => {
          setShowHeart(false);
        }, 1000); // 1秒後に♡マークを非表示
      }, LONG_PRESS_THRESHOLD)
    );
  };

  // ♡マークを非表示するための関数
  const handleLongPressEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  // AIコメント取得のための関数
  const getAiComment = async (cocktail) => {
    const casheName = cocktailId + "Text";
    const cachedValue = localStorage.getItem(casheName);

    if (cachedValue) {
      setAiComments(cachedValue);
    } else {
      try {
        if (cocktail.length !== 0) {
          const reqData = JSON.stringify(cocktail[0].ingredients);

          //console.log(`${REC_BASE_URL}/snack`)
          const getRes = await axios.get(
            `https://jlz4scm3x1.execute-api.us-east-1.amazonaws.com/dev/api/snack`,
            {
              params: {
                ingredients: reqData,
              },
            }
          );

          // ↓バーテンダーコメントをセット
          localStorage.setItem(casheName, getRes.data);
          setAiComments(getRes.data);
        }
      } catch (err) {
        console.log(err.response.status);
        if (err.response.status === 500) {
          //setAiComments("...すみません聞き取れませんでした");
        } else {
          console.error("setAiComment 関連でエラーが発生", err);
        }
      }
    }
  };

  // 材料のTooltipをOpen/Closeするための関数
  const handleTooltip = () => {
    setTooltipOpen((prev) => !prev)
  }

  // 材料のTooltipサイズを設定
  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 500,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const module = await import("../assets/data/cocktails_jp.json");
        const response = await axios.get(`${BASE_URL}/recipes`, {
          params: {
            cocktailId: cocktailId,
          },
        });
        const data = response.data;

        if (Array.isArray(data)) {
          setCocktails(data); // 配列ならそのまま設定
          console.log("Valid Data");
        } else {
          console.error("Expected an array but got:", data);
          console.log("不正なデータ");
          setCocktails([]); // 不正なデータの場合は空配列
        }
      } catch (error) {
        console.error("Failed to fetch cocktails data:", error);
        console.log("フェッチ失敗");
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

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/favorites`, {
          params: { cocktailId: cocktailId },
        });
        setLikeCount(res.data.favoriteNum); // 初期のいいね数を設定
      } catch (err) {
        console.error("いいね数の取得でエラーが発生", err);
      }
    };
    fetchLikeCount();
  }, []);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/favorites`, {
          params: {
            cocktailId: cocktailId,
            userId: 1,
          },
        });

        if (res.data.exists === 1) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      } catch (err) {
        console.error("いいねの状態を取得できませんでした", err);
      }
    };

    fetchLikeStatus();
  }, [cocktailId]);

  useEffect(() => {
    if (cocktail.length > 0) {
      getAiComment(cocktail);
    }
  }, [cocktails]);

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
            <div style={{ position: "relative" }}>
              <img
                src={cocktails[0].strDrinkThumb}
                alt="Cocktail"
                className="detail-cocktail-image"
                style={{ borderRadius: "8px" }}
                onMouseDown={handleLongPressStart}
                onMouseUp={handleLongPressEnd}
                onTouchStart={handleLongPressStart}
                onTouchEnd={handleLongPressEnd}
              />
              {showHeart && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "5rem",
                    color: "#C15F50",
                    pointerEvents: "none", // 背景クリックイベントを無視
                  }}
                >
                  ♥
                </div>
              )}
            </div>
            <div className="cocktail-header">
              <IconButton onClick={handleLikeButtonClick}>
                <FavoriteTwoToneIcon
                  sx={{
                    color: isLiked ? "#C15F50" : "white",
                  }}
                />
              </IconButton>
              <span
                style={{ fontSize: "1.2rem", marginLeft: "0px", color: "#555" }}
              >
                {likeCount}
              </span>
              <IconButton onClick={handleClick}>
                <CheckCircleIcon
                  sx={{
                    color: isChecked ? "#C15F50" : "white",
                  }}
                />
              </IconButton>
              <h1 className="detail-cocktail-name">{cocktail[0].strDrink}</h1>
            </div>
            <Paper sx={{ borderRadius: "16px", padding: "14px", marginTop: 4 }}>
              <div className="ingredients">
                <div className="ingredients-title">
                  <h2>材料</h2>
                  <CustomWidthTooltip 
                    title={
                      <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 1fr', gap: '8px' }}>
                        <Typography>
                          dash: 一滴<br />
                          splash: 数滴<br />
                          tsp: 約5ml<br />
                          oz: 約30ml<br />
                          jigger: 約45ml<br />
                          shot: 約45ml<br />
                          gr: グラム<br />
                          ml: ミリリットル<br />
                        </Typography>
                        <Typography>
                          cubes: 立方体の氷<br />
                          twist of: 皮を添えること<br />
                          slice: スライスして添えること
                          bottle: ボトル<br />
                          part: 材料の比率<br />
                          Fill with: 飲料で満たすこと<br />
                          Top it up with: 満たすこと<br />
                        </Typography>
                      </div>
                    }
                    placement="top-end"
                    arrow
                    open={tooltipOpen}
                    onClose={() => setTooltipOpen(false)}
                  >
                    <IconButton
                      onClick={handleTooltip}
                      sx={{
                        marginTop: "17px",
                        width: "30px",
                        height: "30px",
                      }}
                    >
                      <HelpOutlineIcon
                        sx={{
                          fontSize: "1rem",
                        }}
                      />
                    </IconButton>
                  </CustomWidthTooltip>
                </div>
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
              
              <div
                className="ingredients"
                // style={{ display: "flex", alignItems: "center" }}
              >
                <h2 className="AI-title">バーテンダーから一言</h2>
                {/* 1列目: 画像 */}
                <div style={{ marginRight: "16px" }}>
                  <div className="AI-image">
                    <img
                      src="https://cocktify-images.s3.us-east-1.amazonaws.com/bartender.png" // 画像のパスを指定
                      alt="bartender"
                      style={{
                        width: "120px", // 画像のサイズ
                        height: "120px", // 画像のサイズ
                        borderRadius: "15%", // 円形にする場合
                        objectFit: "cover", // 画像が枠内に収まるように調整
                        float: "right",
                        marginTop: "16px"
                      }}
                    />
                  </div>
                </div>
                
                {/* 2列目: タイトルとテキスト */}
                <div style={{ flex: 1 }}>
                  {aiComments === null ? (
                    <p style={{
                      marginBottom: "100px"
                    }}>考え中です・・・</p>
                  ) : (
                    <p>{aiComments}</p>
                  )}
                </div>
              </div>
            </Paper>
          </Box>
        </div>
      )}
    </>
  );
};
