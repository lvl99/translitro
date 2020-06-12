import { transliterate } from "transliteration";
import pinyin from "pinyin";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import { get, applyFnTo, asyncApplyFnTo } from "./utils";

export type TranslitroSubject =
  | string
  | TranslitroSubjectObject
  | TranslitroSubject[];

export interface TranslitroSubjectObject {
  [name: string]: TranslitroSubject;
}

export interface TranslitroOptionsObject {
  from?: string;
}

export interface TranslitroChineseOptions
  extends Omit<TranslitroOptionsObject, "from"> {
  from: "zh";
  to?: "normal" | "tone" | "tone2" | "to3ne" | "initials" | "firstLetter";
}

export interface TranslitroJapaneseOptionsObject
  extends Omit<TranslitroOptionsObject, "from"> {
  from: "ja";
  to?: "hiragana" | "katakana" | "romaji";
  mode?: "normal" | "spaced" | "okurigana" | "furigana";
}

export interface TranslitroJapaneseRomajiOptions
  extends Omit<TranslitroJapaneseOptionsObject, "to"> {
  to: "romaji";
  romajiSystem?: "passport" | "nippon" | "hepburn";
}

export type TranslitroJapaneseOptions =
  | TranslitroJapaneseOptionsObject
  | TranslitroJapaneseRomajiOptions;

export type TranslitroOptions =
  | TranslitroOptionsObject
  | TranslitroChineseOptions
  | TranslitroJapaneseOptions;

const PinyinStyle = {
  normal: pinyin.STYLE_NORMAL,
  tone: pinyin.STYLE_TONE,
  tone2: pinyin.STYLE_TONE2,
  to3ne: pinyin.STYLE_TO3NE,
  initials: pinyin.STYLE_INITIALS,
  firstLetter: pinyin.STYLE_FIRST_LETTER,
};

const core: {
  initialized: boolean;
  kuroshiro: Kuroshiro;
  analyzer: KuromojiAnalyzer;
} = {
  initialized: false,
  kuroshiro: {} as Kuroshiro,
  analyzer: {} as KuromojiAnalyzer,
};

const translitro = async (
  input: TranslitroSubject,
  options?: TranslitroOptions
): Promise<TranslitroSubject> => {
  const { from, to, mode = "spaced", romajiSystem = "passport" } = {
    ...options,
  };

  switch (from) {
    case "zh":
      const style =
        to && Object.keys(PinyinStyle).includes(to)
          ? get(PinyinStyle, to)
          : PinyinStyle.normal;

      const zhTransliterate = (i: string) =>
        pinyin(i, {
          style,
        })
          // Collapse letters within words
          .map((word: string[]) => word.join(""))
          // Join words with spaces
          .join(" ")
          .trim();

      return Promise.resolve(applyFnTo(input, zhTransliterate));

    case "ja":
      // Initialise Kuroshiro if not already done
      if (!core.initialized) {
        core.kuroshiro = new Kuroshiro();
        core.analyzer = new KuromojiAnalyzer();
        core.initialized = await core.kuroshiro
          .init(core.analyzer)
          .then(() => true);
      }

      const convertOptions: { [key: string]: string } = {
        to: to || "romaji",
      };

      switch (convertOptions.to) {
        case "romaji":
          convertOptions.mode = mode || "spaced";
          convertOptions.romajiSystem = romajiSystem || "passport";
          break;

        case "hiragana":
        case "katakana":
          convertOptions.mode = "normal";
          break;
      }

      const jaTransliterate = async (i: string): Promise<string> =>
        await core.kuroshiro.convert(i, convertOptions);

      return asyncApplyFnTo(input, jaTransliterate);

    default:
      return Promise.resolve(applyFnTo(input, transliterate));
  }
};

export default translitro;
