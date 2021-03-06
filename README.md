# Translitro

Normalise and transform special characters and non-latin characters (including Chinese and Japanese) to basic latin characters.

Perfect for when needing to transform data for searching, sorting and inserting into systems that support only the basic latin character set.

## About

This package stands on the shoulders of these giants:

- [`transliteration`](https://github.com/dzcpy/transliteration)
- [`pinyin`](https://github.com/hotoo/pinyin)
- [`kuroshiro`](https://github.com/hexenq/kuroshiro)

> Note: this library is not intended for use within the browser, due to the size of the dependencies (Japanese data files are ~19mb). If you need to normalise/sanitise data, it is best to do it server-side anyway!

## Installation

```sh
  npm i translitro
  yarn add translitro
```

## Usage

Within your code, `translitro` returns a promise with the transliterated output:

```js
const translitro = require("translitro").default;

translitro("åéîøü").then((o) => console.log(o));

// "aeiou"
```

```typescript
import translitro from "translitro";

console.log(await translitro("åéîøü"));

// "aeiou"
```

It's also possible to transliterate values within arrays and objects with a single call:

```js
const translitro = require("translitro").default;

// Array
translitro(["åéîøü", "مرحبا", "γεια σας", "여보세요"]).then((o) =>
  console.log(o)
);

/*
  [
    "aeiou",
    "mrHb",
    "geia sas",
    "yeoboseyo"
  ]
*/

// Object
translitro({
  specialCharacters: "åéîøü",
  arabic: "مرحبا",
  greek: "γεια σας",
  korean: "여보세요",
}).then((o) => console.log(o));

/*
  {
    specialCharacters: "aeiou",
    arabic: "mrHb",
    greek: "geia sas",
    korean: "yeoboseyo"
  }
*/
```

### Post-processing

After transliterating your input, you can apply some post-processes:

```js
// Object
translitro(
  {
    specialCharacters: "åéîøü",
    arabic: "مرحبا",
    greek: "γεια σας",
    korean: "여보세요",
  },
  {
    postProcess: ["upper"],
  }
).then((o) => console.log(o));

/*
  {
    specialCharacters: "AEIOU",
    arabic: "MRHB",
    greek: "GEIA SAS",
    korean: "YEOBOSEYO"
  }
*/
```

You can also specify multiple post-processes, including custom functions which take a single string input and return a string:

```js
// Object
translitro(
  {
    specialCharacters: "åéîøü",
    arabic: "مرحبا",
    greek: "γεια σας",
    korean: "여보세요",
  },
  {
    postProcess: [
      "upper",
      (i) =>
        i
          .split(/\s+/g)
          .map((o) => o[0])
          .join(" "),
    ],
  }
).then((o) => console.log(o));

/*
  {
    specialCharacters: "A",
    arabic: "M",
    greek: "G S",
    korean: "Y"
  }
*/
```

Current supported post-processes are:

- `normal` (aka `normalize`, `normalise`): converts any special characters to basic latin versions
- `upper` (aka `uppercase`): does what it says
- `lower` (aka `lowercase`): does what it says
- `title` (aka `titlecase`, `capital`, `capitalcase`): does what it says

> Note: post-processes are performed in the order that they are declared.

### Transliterate Chinese and Japanese

When transliterating Chinese and/or Japanese you will have to do those values separately due to needing to specify the input `from` parameter:

#### Chinese

It's necessary to specify `{ from: "zh" }` in options when transliterating Chinese characters:

```js
translitro(["欢迎", "歡迎"], { from: "zh" }).then((o) => console.log(o));
// ["huan ying", "huan ying"]
```

You can also affect the output by specifying the `to` option (accepts `"normal" | "tone2" | "to3ne" | "initials" | "firstLetter"`):

```js
translitro(["欢迎", "歡迎"], { from: "zh", to: "initials" }).then((o) =>
  console.log(o)
);
// ["h", "h"]
```

> Simplified and Traditional forms are both handled easily for Chinese characters, thanks to the might of [pinyin](https://github.com/hotoo/pinyin)

#### Japanese

```js
translitro(["良い一日", "こんにちは", "こうし", "フョ"], {
  from: "ja",
}).then((o) => console.log(o));
// ["yoi ichi nichi", "konnichiwa", "ko shi", "fuyo"]
```

> Note: there are three romaji systems supported: `passport`, `hepburn` and `nippon`.
> `passport` is the default as `hepburn` and `nippon` can also include special characters outside the standard basic latin set, such as ô and ō.

It's also possible to transliterate Japanese to hiragana and katakana:

```js
translitro(["良い一日", "こんにちは", "こうし" /*, "フョ" */], {
  from: "ja",
  to: "hiragana",
}).then((o) => console.log(o));
// ["よいいちにち", "こんにちは", "こうし" /*, "ふょ" */]
```

> Note: there's an [outstanding issue](https://github.com/hexenq/kuroshiro/issues/64) on kuroshiro where in some cases it can't convert katakana to hiragana.

```js
translitro(["良い一日", "こんにちは", "こうし", "フョ"], {
  from: "ja",
  to: "katakana",
}).then((o) => console.log(o));
// ["ヨイイチニチ", "コンニチハ", "コウジ", "フョ"]
```

> Japanese katakana, hiragana and kanji forms are handled thanks to the might of [kuroshiro](https://github.com/hexenq/kuroshiro) and [kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji)

## Development

To download external dependencies:

```bash
  npm i
```

To run tests (using Jest):

```bash
  npm test
  npm run test:watch
```

## Contribute

Got cool ideas? Have questions or feedback? Found a bug? [Post an issue](https://github.com/lvl99/translitro/issues)

Added a feature? Fixed a bug? [Post a PR](https://github.com/lvl99/translitro/compare)

## License

[Apache 2.0](LICENSE.md)
