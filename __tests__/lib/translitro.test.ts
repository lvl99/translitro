import translitro from "../../lib/translitro";

describe("translitro", () => {
  it("should transliterate string", async () => {
    const result = await translitro("åéîøü مرحبا γεια σας 여보세요");
    expect(result).toBe("aeiou mrHb geia sas yeoboseyo");
  });

  it("should transliterate array", async () => {
    const input = ["åéîøü", "مرحبا", "γεια σας", "여보세요"];
    const output = ["aeiou", "mrHb", "geia sas", "yeoboseyo"];
    const result = await translitro(input);
    expect(result).toEqual(expect.arrayContaining(output));
  });

  it("should transliterate object", async () => {
    const input = {
      specialCharacters: "åéîøü",
      arabic: "مرحبا",
      greek: "γεια σας",
      korean: "여보세요",
    };
    const output = {
      specialCharacters: "aeiou",
      arabic: "mrHb",
      greek: "geia sas",
      korean: "yeoboseyo",
    };
    const result = await translitro(input);
    expect(result).toMatchObject(output);
  });

  it("should transliterate Chinese to pinyin (defaults to normal)", async () => {
    const input = ["欢迎", "歡迎"];
    const output = ["huan ying", "huan ying"];
    const result = await translitro(input, { from: "zh" });
    expect(result).toEqual(expect.arrayContaining(output));
  });

  it("should transliterate Chinese to pinyin to tone", async () => {
    const input = ["欢迎", "歡迎"];
    const output = ["huān yíng", "huān yíng"];
    const result = await translitro(input, { from: "zh", to: "tone" });
    expect(result).toEqual(expect.arrayContaining(output));
  });

  it("should transliterate Chinese to pinyin to tone2", async () => {
    const input = ["欢迎", "歡迎"];
    const output = ["huan1 ying2", "huan1 ying2"];
    const result = await translitro(input, { from: "zh", to: "tone2" });
    expect(result).toEqual(expect.arrayContaining(output));
  });

  it("should transliterate Chinese to pinyin to to3ne", async () => {
    const input = ["欢迎", "歡迎"];
    const output = ["hua1n yi2ng", "hua1n yi2ng"];
    const result = await translitro(input, { from: "zh", to: "to3ne" });
    expect(result).toEqual(expect.arrayContaining(output));
  });

  it("should transliterate Chinese to pinyin to initials", async () => {
    const input = ["欢迎", "歡迎"];
    const output = ["h", "h"];
    const result = await translitro(input, { from: "zh", to: "initials" });
    expect(result).toEqual(expect.arrayContaining(output));
  });

  it("should transliterate Chinese to pinyin to first letter", async () => {
    const input = ["欢迎", "歡迎"];
    const output = ["h y", "h y"];
    const result = await translitro(input, { from: "zh", to: "firstLetter" });
    expect(result).toEqual(expect.arrayContaining(output));
  });

  it("should transliterate Japanese to romaji (defaults to romajiSystem: passport)", async () => {
    const input = ["良い一日", "こんにちは", "こうし", "フョ"];
    const output = ["yoi ichi nichi", "konnichiwa", "ko shi", "fuyo"];
    const result = await translitro(input, {
      from: "ja",
    });
    expect(result).toEqual(expect.arrayContaining(output));
  });

  it("should transliterate Japanese to romaji (system: hepburn)", async () => {
    const input = ["良い一日", "こんにちは", "こうし", "フョ"];
    const output = ["yoi ichi nichi", "konnichiwa", "kō shi", "fyo"];
    const result = await translitro(input, {
      from: "ja",
      romajiSystem: "hepburn",
    });
    expect(result).toEqual(expect.arrayContaining(output));
  });

  it("should transliterate Japanese to romaji (system: nippon)", async () => {
    const input = ["良い一日", "こんにちは", "こうし", "フョ"];
    const output = ["yoi iti niti", "konnitiwa", "kô si", "hwyo"];
    const result = await translitro(input, {
      from: "ja",
      romajiSystem: "nippon",
    });
    expect(result).toEqual(expect.arrayContaining(output));
  });

  it("should transliterate Japanese to hiragana", async () => {
    const input = ["良い一日", "こんにちは", "こうし" /*, "フョ" */];
    const output = ["よいいちにち", "こんにちは", "こうし" /*, "ふょ" */];
    const result = await translitro(input, { from: "ja", to: "hiragana" });
    expect(result).toEqual(expect.arrayContaining(output));
  });

  it("should transliterate Japanese to katakana", async () => {
    const input = ["良い一日", "こんにちは", "こうし", "フョ"];
    const output = ["ヨイイチニチ", "コンニチハ", "コウシ", "フョ"];
    const result = await translitro(input, { from: "ja", to: "katakana" });
    expect(result).toEqual(expect.arrayContaining(output));
  });

  it("should run post-processes", async () => {
    const input1 = "こうし";
    const output1 = "ko shi";
    const result1 = await translitro(input1, {
      from: "ja",
      to: "romaji",
      romajiSystem: "passport",
      postProcess: "normalise",
    });
    expect(result1).toBe(output1);

    const input2 = "こうし";
    const output2 = "K";
    const result2 = await translitro(input2, {
      from: "ja",
      to: "romaji",
      romajiSystem: "passport",
      postProcess: [
        "normal",
        "normalise",
        "normalize",
        "upper",
        "uppercase",
        "lower",
        "lowercase",
        "title",
        "titlecase",
        "capital",
        "capitalcase",
        (i) => i[0],
      ],
    });
    expect(result2).toBe(output2);
  });
});
