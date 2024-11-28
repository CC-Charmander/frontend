import React, { useState } from "react";
import axios from "axios";
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ingredients from "../assets/data/ingredients_jp_unique.json";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const bucketName = "cocktify-images";
const identityPoolId = "us-east-1:6b60a7c1-762c-4ce0-9446-6a05de461242";
const maxPhotosFromBucket = 125;
const region = "us-east-1"

// AWS.config.update({
//   region: region,
//   credentials: new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: identityPoolId,
//   }),
// });

const credentials = fromCognitoIdentityPool({
  client: new CognitoIdentityClient({ region }), // CognitoIdentityClientのインスタンスを作成
  identityPoolId, // Cognito Identity Pool ID
});

// const bucket = new AWS.S3({
//   params: {
//     Bucket: bucketName,
//   },
// });

// const s3 = new S3({
//   region: 'ap-northeast-1'
// });

const s3Client = new S3Client({
  region,
  credentials, // Cognito Identity Pool から取得した認証情報を渡す
});



type Recipe = {
  idDrink?: string;
  strDrink: string;
  strTags?: string;
  strCategory?: string;
  strAlcoholic?: string;
  strGlass?: string;
  strInstructions?: string;
  strDrinkThumb: string;
  strCreativeCommonsConfirmed?: string;
  dateModified?: Date;
  ingredients: string[];
  measures: string[];
  user_id: number;
};


const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const measures = [
  "oz",
  "gr",
  "ml",
  "tsp",
  "jigger",
  "twist of",
  "cubes",
  "Fill with",
  "shot",
  "dash",
  "bottle",
  "part",
  "Top it up with",
  "splash",
  "slice",
];

export const PostCocktail = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);  // Snackbarの表示状態
  const [snackbarMessage, setSnackbarMessage] = useState("");  // Snackbarに表示するメッセージ
  const [confirmAction, setConfirmAction] = useState<"none" | "submit" | "cancel">("none"); // ユーザーアクションの管理
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);  // 投稿完了スナックバー

  const [ingredientError, setIngredientError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [unitError, setUnitError] = useState<string | null>(null);

  // ボタンを押したときのバリデーション
  const [titleError, setTitleError] = useState<string | null>(null);
  const [txIngredientError, setTxIngredientError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  
  
  const [inputTitle, setInputTitle] = useState<string>('');
  
  const [inputIngredient, setInputIngredient] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [unit, setUnit] = useState<string>("");

  const [txIngredients, setTxIngredients] = useState<string[]>([]);
  const [txMeasures, setTxMeasures] = useState<string[]>([]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false); 


  const naviate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setSelectedImage(reader.result as string);
        if (imageError) setImageError(null);
      };

      reader.readAsDataURL(file); // Base64データとして画像を読み込む
    }
  };

  const addIngredient = () => {
    let hasError = false;

    // 原材料の選択肢チェック
    if (!ingredients.includes(inputIngredient)) {
      setIngredientError("選択肢から選んでください。");
      hasError = true;
    } else {
      setIngredientError(null);
    }

    // 数量のバリデーション
    if (!amount || isNaN(Number(amount))) {
      setAmountError("数字を入力してください。");
      hasError = true;
    } else {
      setAmountError(null);
    }

    // 単位のバリデーション（空欄かどうかのみチェック）
    if (!unit.trim()) {
      setUnitError("単位を記入してください。");
      hasError = true;
    } else {
      setUnitError(null);
    }

    if (!hasError) {
      setTxIngredients((prev) => [...prev, inputIngredient]);
      setTxMeasures((prev) => [...prev, `${amount} ${unit}`]);
      setInputIngredient("");
      setAmount("");
      setUnit("");
      setTxIngredientError(null);
    }
  };

  const handleDelete = (i: number) => {
    setTxIngredients((prev) => prev.filter((_, j) => j !== i));
    setTxMeasures((prev) => prev.filter((_, j) => j !== i));
  };
  
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(event.target.value); // 入力値を状態にセット
    if (titleError) setTitleError(null);
  };

  const handleInputIngredientChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setInputIngredient(newValue);
    if (txIngredientError) setTxIngredientError(null); // txIngredientErrorをリセット
  };

  // BASE64の形式をBLOBに変換する
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  };

  const checkValidation = async () => {
    let hasError = false;

    // カクテル名が入っているかのチェック
    if (!inputTitle || inputTitle.trim() === '') {
      setTitleError("カクテル名を入力してください。");
      hasError = true;
    }

    // 画像がUpされているかのチェック
    if (!selectedImage) {
      setImageError("画像を必ずアップロードしてください。");
      hasError = true;
    }

    // 材料が入っているかのチェック
    if (txIngredients.length === 0) {
      setTxIngredientError("材料は少なくとも1つ以上選択してください。");
      hasError = true;
    }

    if (hasError) {
      return; // 1つでもエラーがある場合、投稿確認画面に進まずに処理を終了
    }

    // 以下、投稿確認用のスナックバーを表示
    setSnackbarMessage('レシピを投稿します。本当によろしいですか。');
    setConfirmAction("submit");
    setOpenSnackbar(true);
  }

  const postCocktail = async () => {
    if (selectedImage !== null){
        setIsUploading(true);
        const mimeType = selectedImage.split(';')[0].split(':')[1];
        const blob = base64ToBlob(selectedImage, mimeType);
        const key = `${Date.now()}_${Math.random()}.${mimeType.split('/')[1]}`
    
        // new Promise((resolve, reject) => {
        //   bucket.putObject(
        //     {
        //       Bucket: bucketName,
        //       Key: key,
        //       Body: blob,
        //       ContentType: mimeType,
        //     },
        //     (error, data) => {
        //       if (error) {
        //         console.error("error: ", error);
        //         return;
        //       }
        //       resolve(data);
        //     }
        //   );
        // });

        // PutObjectCommandでS3へアップロード
        const putObjectCommand = new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: blob,
          ContentType: mimeType,
        });
        
        const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`; 
        //const imageUrl = `https://cocktify-images.s3.us-east-1.amazonaws.com/Cocktail1.jpg`; 
        
        // レシピDBへ登録用のオブジェクトを作成
        const Recipe: Recipe = {
          strDrink: inputTitle, 
          strTags: 'test',  // 任意のタグ
          ingredients: txIngredients,
          measures: txMeasures,
          strDrinkThumb: imageUrl,  // 画像URL
          user_id: 1, // TODO: 仮user_id「1」で固定。ログイン機能実装後に差し替える。
        };

        try {
          // レシピ投稿APIへPOSTリクエストを送信
          await axios.post(BASE_URL + '/recipes', Recipe);
          const data = await s3Client.send(putObjectCommand);
          console.log("Successfully uploaded object to S3", data);

          // 成功した場合、成功を表示するスナックバーを表示
          setSnackbarMessage('カクテルの投稿が完了しました！');
          setOpenSnackbar(false);
          setOpenSuccessSnackbar(true);

          // スナックバー表示のため、インターバルを設ける
          await new Promise(resolve => setTimeout(resolve, 3000));
          // ホーム画面に遷移
          naviate("/")

        } catch (error) {
          console.error("Error uploading object to S3", error);
          setOpenSnackbar(false);
          setSnackbarMessage('投稿に失敗しました。再度お試しください。');
        }
    }

  };

  return (
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
          <IconButton onClick={() => naviate("/")}>
            <ArrowBackIcon />
          </IconButton>
          <Box flexGrow={1} textAlign="center" marginRight="56px">
            <Typography>新規投稿</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Stack padding={2} marginBottom="68px">
        <Card sx={{ marginTop: "76px", padding: "24px", borderRadius: "16px" }}>
          <Typography gutterBottom>画像</Typography>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="選択された画像"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                marginBottom: "12px",
              }}
            />
          )}
          <Button component="label" role={undefined} variant="text" tabIndex={-1} startIcon={<CloudUploadIcon />}>
            画像を選択する
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              multiple={false}
              style={{ display: "none" }} // 隠す
            />
          </Button>
          {imageError && (
            <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
              {imageError}
            </Typography>
          )}
        </Card>
        <Card sx={{ padding: "24px", marginTop: 2, borderRadius: "16px" }}>
          <Typography gutterBottom>カクテル名</Typography>
          <TextField variant="outlined" placeholder="" fullWidth value={inputTitle} onChange={handleTitleChange} error={!!titleError} helperText={titleError}></TextField>
        </Card>
        <Card sx={{ padding: "24px", marginTop: 2, borderRadius: "16px" }}>
          <Typography gutterBottom>材料</Typography>
          <Stack direction="row" alignItems="center">
            <Autocomplete
              value={inputIngredient}
              onInputChange={(event, newValue) => {
                setInputIngredient(newValue);
                setIngredientError(null);
                handleInputIngredientChange;
              }}
              options={ingredients}
              sx={{ flex: 1 }}
              renderInput={(params) => (
                <TextField {...params} placeholder="原材料" error={!!ingredientError} helperText={ingredientError} />
              )}
            />
          </Stack>
          <Stack sx={{ marginTop: "12px" }} direction="row">
            <span style={{ margin: "12px", fontSize: "20px" }}>&gt;</span>
            <TextField
              variant="outlined"
              placeholder="数量"
              sx={{
                width: "90px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px 0 0 4px",
                },
              }}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={!!amountError}
              helperText={amountError}
            />
            <Autocomplete
              freeSolo // 選択肢以外も入力可能にする
              onInputChange={(event, newValue) => {
                setUnit(newValue);
                setUnitError(null);
              }}
              value={unit}
              options={measures}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0 4px 4px 0",
                },
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="単位" error={!!unitError} helperText={unitError} />
              )}
            />
          </Stack>
          <Button sx={{ width: "120px", margin: "0 auto", marginTop: "12px" }} onClick={addIngredient}>
            材料を追加
          </Button>
          {txIngredients.length !== 0 && (
            <Stack spacing={1} marginTop={2}>
              {txIngredients.map((ing, i) => (
                <Chip label={`${ing}: ${txMeasures[i]}`} onDelete={() => handleDelete(i)} key={i} />
              ))}
            </Stack>
          )}
          {/* エラー表示 */}
          {txIngredientError && (
            <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
              {txIngredientError}
            </Typography>
          )}

        </Card>
      </Stack>
      <Box
        component={Card}
        elevation={3}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 1200, // 必要に応じて調整 (AppBarなどと重ならないように)
          padding: 2,
          borderRadius: 0,
        }}
      >
        <Button fullWidth onClick={checkValidation} variant="contained">
          シェア
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={null}
        onClose={() => setOpenSnackbar(false)}
        sx={{
          position: 'fixed', // 固定表示
          top: '20px', // 上部からの距離を調整
          left: '50%', // 中央寄せ
          transform: 'translateX(-50%)', // 画面の中央に配置
          zIndex: 1300, // 他の要素との重なり順
        }}
      >
        <Alert
          severity="info"
          sx={{
            width: "auto", // 自動的にコンテンツの幅に合わせる
            display: "flex",
            flexDirection: "column", // 縦並びにする
            padding: 0, // スナックバー内の余白を最小限に
          }}
        >
            <>
          <Box sx={{ textAlign: "center", paddingBottom: 1 }}>
          {snackbarMessage}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              color="inherit"
              size="small"
              onClick={postCocktail}
              sx={{ flex: 1 }}
            >
              OK
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                setConfirmAction("cancel");
                setOpenSnackbar(false);
              }}
              sx={{ flex: 1 }}
            >
              NG
            </Button>
          </Box>
          </>
        </Alert>
      </Snackbar>
            {/* 投稿完了スナックバー */}
            <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={3000}
        sx={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1300,
        }}
      >
        <Alert
          severity="success"
          sx={{
            width: "auto",
            display: "flex",
            flexDirection: "column",
            padding: 0,
          }}
        >
          {/* 投稿完了メッセージ */}
          <Box sx={{ textAlign: "center", paddingBottom: 1 }}>
            カクテルの投稿が完了しました！
          </Box>
        </Alert>
      </Snackbar>
    </div>
  );
};