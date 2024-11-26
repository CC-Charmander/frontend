import React, { useState } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ingredients from "../assets/data/ingredients_jp_unique.json";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

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
  const [ingredientError, setIngredientError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [unitError, setUnitError] = useState<string | null>(null);

  const [inputIngredient, setInputIngredient] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [unit, setUnit] = useState<string>("");

  const [txIngredients, setTxIngredients] = useState<string[]>([]);
  const [txMeasures, setTxMeasures] = useState<string[]>([]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const naviate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setSelectedImage(reader.result as string);
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
    }
  };

  const handleDelete = (i: number) => {
    setTxIngredients((prev) => prev.filter((_, j) => j !== i));
    setTxMeasures((prev) => prev.filter((_, j) => j !== i));
  };

  const postCocktail = () => {
    //TODO:
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
      <Stack padding={4}>
        <Typography gutterBottom marginTop="76px">
          画像
        </Typography>
        {selectedImage && (
          <img
            src={selectedImage}
            alt="選択された画像"
            style={{
              maxWidth: "100%",
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

        <Typography gutterBottom marginTop={4}>
          カクテル名
        </Typography>
        <TextField variant="outlined" placeholder=""></TextField>
        <Typography gutterBottom marginTop={4}>
          材料
        </Typography>
        <Stack direction="row" alignItems="center">
          <Autocomplete
            value={inputIngredient}
            onInputChange={(event, newValue) => {
              setInputIngredient(newValue);
              setIngredientError(null);
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
        <Stack spacing={1} marginTop={2} marginBottom={6}>
          {txIngredients.map((ing, i) => (
            <Chip label={`${ing}: ${txMeasures[i]}`} onDelete={() => handleDelete(i)} key={i} />
          ))}
        </Stack>
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
        <Button fullWidth onClick={postCocktail} variant="contained">
          シェア
        </Button>
      </Box>
    </div>
  );
};
