import fs from "fs";

// 元の JSON ファイルの読み込み
const inputFilePath = "./src/assets/data/cocktails.json"; // 入力ファイル名
const outputFilePath = "./src/assets/data/cocktails_filtered.json"; // 出力ファイル名

// ファイルを読み込む
const rawData = fs.readFileSync(inputFilePath, "utf-8");
const data = JSON.parse(rawData);

// 重複を除く処理
const uniqueCocktails = [];
const seenIds = new Set();

data.cocktails.forEach((cocktail) => {
  if (!seenIds.has(cocktail.idDrink)) {
    uniqueCocktails.push(cocktail);
    seenIds.add(cocktail.idDrink);
  }
});

// 新しい JSON を作成
const filteredData = { cocktails: uniqueCocktails };

// ファイルに保存
fs.writeFileSync(outputFilePath, JSON.stringify(filteredData, null, 2), "utf-8");

console.log(`Filtered data saved to ${outputFilePath}`);
