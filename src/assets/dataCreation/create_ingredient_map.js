import fs from "fs";

// 元の JSON ファイルの読み込み
const inputFileJPPath = "./src/assets/data/ingredients_jp.json"; // 入力ファイル名
const inputFileENPath = "./src/assets/data/ingredients.json"; // 入力ファイル名
const outputFilePath = "./src/assets/data/ingredients_from_jp_to_en.json"; // 出力ファイル名

// ファイルを読み込む
const rawJPData = fs.readFileSync(inputFileJPPath, "utf-8");
const ingredientsJP = JSON.parse(rawJPData);

const rawENData = fs.readFileSync(inputFileENPath, "utf-8");
const ingredientsEN = JSON.parse(rawENData);

const obj = {};

ingredientsEN.forEach((ingen, i) => {
  obj[ingredientsJP[i]] = ingen;
});

console.log(obj);
fs.writeFileSync(outputFilePath, JSON.stringify(obj, null, 2), "utf-8");

// 新しい JSON を作成
// const filteredData = { cocktails: uniqueCocktails };

// ファイルに保存
// fs.writeFileSync(outputFilePath, JSON.stringify(filteredData, null, 2), "utf-8");

console.log(`Filtered data saved to ${outputFilePath}`);
