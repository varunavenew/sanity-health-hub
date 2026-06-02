export type I18nItem = {
  _type: string;
  _key?: string;
  language: string;
  value: string;
};

export function i18nString(no: string, en: string): I18nItem[] {
  return [
    { _type: "internationalizedArrayStringValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayStringValue", _key: "en", language: "en", value: en },
  ];
}

export function i18nText(no: string, en: string): I18nItem[] {
  return [
    { _type: "internationalizedArrayTextValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayTextValue", _key: "en", language: "en", value: en },
  ];
}

export function tags(pairs: [string, string][]): I18nItem[][] {
  return pairs.map(([no, en]) => i18nString(no, en));
}
