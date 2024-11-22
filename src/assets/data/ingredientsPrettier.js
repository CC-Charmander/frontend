import fs from "fs";
import ingredients from "./ingredients_jp.json" assert { type: "json" };

// 重複を削除
const uniqueIngredients = Array.from(new Set(ingredients));

// JSONに変換
const jsonOutput = JSON.stringify(uniqueIngredients, null, 2);

// JSONファイルに書き込み
fs.writeFileSync("ingredients_jp_unique.json", jsonOutput, "utf8");

console.log("重複を削除したJSONファイルを出力しました: ingredients_jp_unique.json");
