import { transliterate } from "transliteration";
import pinyin from "pinyin";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import { capitalCase } from "change-case";
import { get, applyFnTo, asyncApplyFnTo } from "./utils";
import XRegExp from "xregexp";

export type TranslitroSubject =
  | string
  | TranslitroSubjectObject
  | TranslitroSubject[];

export type TranslitroPostProcessPreset =
  | "normal"
  | "normalise"
  | "normalize"
  | "lower"
  | "lowercase"
  | "upper"
  | "uppercase"
  | "title"
  | "titlecase"
  | "capital"
  | "capitalcase";
export type TranslitroPostProcessFunction = (input: string) => string;
export type TranslitroPostProcess =
  | TranslitroPostProcessPreset
  | TranslitroPostProcessFunction;

export interface TranslitroSubjectObject {
  [name: string]: TranslitroSubject;
}

export interface TranslitroOptionsObject {
  from?: string;
  postProcess?: TranslitroPostProcess | TranslitroPostProcess[];
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

const RE_SEGMENT_MARKERS = XRegExp("(\\s|[^\\s\\d\\pL])");
const RE_SEGMENTS = XRegExp("(\\s+|[\\d\\pL]+|[^\\s\\d\\pL]+)", "g");

/**
 * Supported post processes
 */
const getPostProcess = (
  name: string
): TranslitroPostProcessFunction | undefined => {
  switch (name) {
    case "normal":
    case "normalize":
    case "normalise":
      return (input: string) => transliterate(input);

    case "upper":
    case "uppercase":
      return (input: string) => input.toUpperCase();

    case "lower":
    case "lowercase":
      return (input: string) => input.toLowerCase();

    case "title":
    case "titlecase":
    case "capital":
    case "capitalcase":
      return (input: string) => capitalCase(input);
  }
};

const translitro = async (
  input: TranslitroSubject,
  options?: TranslitroOptions
): Promise<TranslitroSubject> => {
  const {
    from,
    to,
    mode = "spaced",
    romajiSystem = "passport",
    postProcess = [],
  } = {
    ...options,
  };

  let output = input;

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

      output = applyFnTo(input, zhTransliterate);
      break;

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

      let jaTransliterate = async (i: string): Promise<string> =>
        await core.kuroshiro.convert(i, convertOptions);

      switch (convertOptions.to) {
        case "romaji":
          convertOptions.mode = mode || "spaced";
          convertOptions.romajiSystem = romajiSystem || "passport";

          if (convertOptions.mode === "spaced") {
            jaTransliterate = async (i: string): Promise<string> => {
              // kuroshiro has a tendency to add extra blankspace when spaces exist and `mode: spaced`
              if (RE_SEGMENT_MARKERS.test(i)) {
                const segments = i.match(RE_SEGMENTS);
                const processSegment = (j: string): Promise<string> =>
                  RE_SEGMENT_MARKERS.test(j)
                    ? Promise.resolve(j)
                    : core.kuroshiro.convert(j, convertOptions);
                const processedSegments = await asyncApplyFnTo(
                  segments,
                  processSegment
                );
                return processedSegments.join("");
              } else {
                // If no blankspace detected, process like normal
                return await core.kuroshiro.convert(i, convertOptions);
              }
            };
          }
          break;

        case "hiragana":
        case "katakana":
          convertOptions.mode = "normal";
          break;
      }

      output = await asyncApplyFnTo(input, jaTransliterate);
      break;

    default:
      output = applyFnTo(input, transliterate);
      break;
  }

  //  Run any post processes
  const postProcesses = (postProcess instanceof Array
    ? postProcess
    : [postProcess]
  )
    .map((p) => (typeof p === "string" ? getPostProcess(p) : p))
    .filter((p) => p instanceof Function);
  if (postProcesses.length) {
    postProcesses.forEach((p) => {
      if (p) {
        output = applyFnTo(output, p);
      }
    });
  }

  return Promise.resolve(output);
};

export default translitro;
