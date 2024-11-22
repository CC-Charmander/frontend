import fs from "fs";

// 元の JSON ファイルの読み込み
const inputFilePath = "./src/assets/data/cocktails_filtered.json"; // 入力ファイル名
const outputFilePath = "./src/assets/data/ingredients.json"; // 出力ファイル名

// ファイルを読み込む
const rawData = fs.readFileSync(inputFilePath, "utf-8");
const data = JSON.parse(rawData);

// 材料を抽出し、重複を除く
const ingredientsSet = new Set();

data.cocktails.forEach((cocktail) => {
  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}`];
    if (ingredient) {
      ingredientsSet.add(ingredient.trim());
    }
  }
});

// 重複を除いた材料一覧を配列に変換
const ingredientsList = Array.from(ingredientsSet).sort();

// JSON データとして保存
fs.writeFileSync(outputFilePath, JSON.stringify(ingredientsList, null, 2), "utf-8");

console.log(`Ingredients list saved to ${outputFilePath}`);
