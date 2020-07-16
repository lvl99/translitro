declare module "kuroshiro" {
  interface ParsedTokenVerbose {
    word_id: number;
    word_type: string;
    word_position: number;
  }

  interface ParsedToken {
    surface_form: string;
    pos: string;
    pos_detail_1: string;
    pos_detail_2: string;
    pos_detail_3: string;
    conjugated_type: string;
    conjugated_form: string;
    basic_form: string;
    reading: string;
    pronunciation: string;
    verbose: ParsedTokenVerbose;
  }

  interface ConvertOptions {
    to?: "hiragana" | "katakana" | "romaji";
    mode?: "normal" | "spaced" | "okurigana" | "furigana";
    romajiSystem?: "hepburn" | "passport" | "nippon";
    delimiter_start?: string;
    delimiter_end?: string;
  }

  interface Analyzer {
    init(): void;
    parse(str: string): ParsedToken[];
  }

  interface Util {
    isHiragana(ch: string): boolean;
    isKatakana(ch: string): boolean;
    isKana(ch: string): boolean;
    isKanji(ch: string): boolean;
    isJapanese(ch: string): boolean;
    hasHiragana(str: string): boolean;
    hasKatakana(str: string): boolean;
    hasKana(str: string): boolean;
    hasKanji(str: string): boolean;
    hasJapanese(str: string): boolean;
    kanaToHiragna(str: string): boolean;
    kanaToKatakana(str: string): boolean;
    kanaToRomaji(str: string): boolean;
  }

  class Kuroshiro {
    constructor();
    _analyzer: null | Analyzer;
    Util: Util;
    init(analyzer: Analyzer): Promise<void>;
    convert(str: string, options?: ConvertOptions): Promise<string>;
  }

  export = Kuroshiro;
}
