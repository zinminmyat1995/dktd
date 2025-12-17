import { usePage } from "@inertiajs/react";

export default function useTranslate() {
  const { props } = usePage();
  const dict = props.translations ?? {};

  // key example: "messages.home"
  const t = (key, fallback = key) => {
    const parts = key.split(".");
    let cur = dict;

    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p];
      } else {
        return fallback;
      }
    }

    return typeof cur === "string" ? cur : fallback;
  };

  return { t, locale: props.locale ?? "en" };
}
