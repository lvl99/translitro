declare module "kuroshiro-analyzer-kuromoji" {
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

  interface AnalyzerOptions {
    dictPath: string;
  }

  class Analyzer {
    constructor(options?: Partial<AnalyzerOptions>);
    init(): Promise<void>;
    parse(str: string): ParsedToken[];
  }

  export = Analyzer;
}
