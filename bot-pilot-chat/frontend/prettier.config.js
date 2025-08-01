/** @type {import("prettier").Config} */
export default {
  printWidth: 100, // maximale Zeilenlänge
  tabWidth: 2, // Größe von Tabs
  useTabs: false, // statt Tabs -> Leerzeichen
  semi: true, // Semikolons am Zeilenende
  singleQuote: true, // einfache statt doppelte Anführungszeichen
  trailingComma: "es5", // abschließende Kommas wo sinnvoll
  bracketSpacing: true, // Leerzeichen zwischen geschweiften Klammern
  arrowParens: "always", // Klammern um Arrow-Function-Parameter
  endOfLine: "lf", // Line-Endings erzwingen (lf = Unix)
};
