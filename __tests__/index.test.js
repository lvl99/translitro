const package = require("../dist");
const translitro = package.default;

describe("translitro", () => {
  it("should import correctly", () => {
    expect(package).toHaveProperty("default");
    expect(package.default).toBeInstanceOf(Function);
  });

  it("should work as advertised in README.md", async () => {
    const input1 = await translitro("åéîøü");
    const output1 = "aeiou";
    expect(input1).toBe(output1);

    const input2 = await translitro(["åéîøü", "مرحبا", "γεια σας", "여보세요"]);
    const output2 = ["aeiou", "mrHb", "geia sas", "yeoboseyo"];
    expect(input2).toEqual(expect.arrayContaining(output2));

    const input3 = await translitro({
      specialCharacters: "åéîøü",
      arabic: "مرحبا",
      greek: "γεια σας",
      korean: "여보세요",
    });
    const output3 = {
      specialCharacters: "aeiou",
      arabic: "mrHb",
      greek: "geia sas",
      korean: "yeoboseyo",
    };
    expect(input3).toMatchObject(output3);

    const input4 = await translitro(["欢迎", "歡迎"], { from: "zh" });
    const output4 = ["huan ying", "huan ying"];
    expect(input4).toEqual(expect.arrayContaining(output4));

    const input5 = await translitro(["欢迎", "歡迎"], {
      from: "zh",
      to: "initials",
    });
    const output5 = ["h", "h"];
    expect(input5).toEqual(expect.arrayContaining(output5));

    const input6 = await translitro(
      ["良い一日", "こんにちは", "こうし", "フョ"],
      {
        from: "ja",
      }
    );
    const output6 = ["yoi ichi nichi", "konnichiwa", "ko shi", "fuyo"];
    expect(input6).toEqual(expect.arrayContaining(output6));

    const input7 = await translitro(
      ["良い一日", "こんにちは", "こうし" /*, "フョ" */],
      {
        from: "ja",
        to: "hiragana",
      }
    );
    const output7 = ["よいいちにち", "こんにちは", "こうし" /*, "ふょ" */];
    expect(input7).toEqual(expect.arrayContaining(output7));

    const input8 = await translitro(
      ["良い一日", "こんにちは", "こうし", "フョ"],
      {
        from: "ja",
        to: "katakana",
      }
    );
    const output8 = ["ヨイイチニチ", "コンニチハ", "コウシ", "フョ"];
    expect(input8).toEqual(expect.arrayContaining(output8));
  });
});
