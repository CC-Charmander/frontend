import cocktails from "../data/cocktails_filtered.json" assert { type: "json" };
import ingredientsMap from "../data/ingredients_from_en_to_jp.json" assert { type: "json" };
import fs from "fs";

const transformCocktail = (cocktail) => {
  const extractArray = (prefix, count) => {
    const result = [];
    for (let i = 1; i <= count; i++) {
      const value = cocktail[`${prefix}${i}`];
      if (value) {
        if (prefix === "strIngredient") {
          const jpValue = ingredientsMap[value];
          result.push(jpValue);
        } else {
          result.push(value);
        }
      }
    }
    return result;
  };

  // 配列化する
  const ingredients = extractArray("strIngredient", 15);
  const measures = extractArray("strMeasure", 15);

  // 不要なプロパティを削除
  const cleanedCocktail = { ...cocktail };
  for (let i = 1; i <= 15; i++) {
    delete cleanedCocktail[`strIngredient${i}`];
    delete cleanedCocktail[`strMeasure${i}`];
  }
  const wantToDeleteItem = [
    "strDrinkAlternate",
    "strVideo",
    "strIBA",
    "strInstructionsES",
    "strInstructionsDE",
    "strInstructionsFR",
    "strInstructionsIT",
    "strInstructionsZH-HANS",
    "strInstructionsZH-HANT",
    "strImageAttribution",
    "strImageSource",
  ];
  for (let item of wantToDeleteItem) {
    delete cleanedCocktail[item];
  }

  // 新しいプロパティを追加
  return {
    ...cleanedCocktail,
    ingredients,
    measures,
  };
};

const outputFilePath = "./src/assets/data/cocktails_jp.json"; // 出力ファイル名

const obj = cocktails.cocktails.map((cocktail) => transformCocktail(cocktail));
fs.writeFileSync(outputFilePath, JSON.stringify(obj, null, 2), "utf-8");
