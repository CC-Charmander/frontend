import fs from "fs";
import cocktailName from "./cocktailName.json" assert { type: "json" };

const outputFilePath = "./src/assets/data/cocktails.json"; // 保存先のファイル名

// 既存のデータを読み込むか、初期化
let cocktailsData = { cocktails: [] };
if (fs.existsSync(outputFilePath)) {
  cocktailsData = JSON.parse(fs.readFileSync(outputFilePath, "utf-8"));
}

const fetchCocktails = async () => {
  for (const name of cocktailName.names) {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=`;
    const encodedUrl = encodeURIComponent(name);

    try {
      const response = await fetch(url + encodedUrl);
      const data = await response.json();

      if (data && data.drinks) {
        // data を追加
        cocktailsData.cocktails.push(...data.drinks);
      }
    } catch (error) {
      console.error(`Error fetching data for ${name}:`, error);
    }
    console.log(name + ":done");
  }

  // ファイルに保存
  fs.writeFileSync(outputFilePath, JSON.stringify(cocktailsData, null, 2), "utf-8");
  console.log("Cocktails data saved successfully!");
};

fetchCocktails();
