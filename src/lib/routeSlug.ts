// translates to/from UUID and a base-62 string.
// generates a short URL slug representing scaleId, used for routing to a scale page, e.g. /scale/abc123.

import { createTranslator } from "short-uuid";

const BASE62_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const routeSlugTranslator = createTranslator(BASE62_ALPHABET);
