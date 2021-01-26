const _BASE62_ST = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// base62编码
export function base62(src: number, len = 0): string {
  let rst = "";
  const negative = src < 0;
  if (negative) src = -src;
  while (1) {
    const a = ~~src % 62;
    rst = _BASE62_ST[a] + rst;
    src = ~~(src / 62);
    if (src <= 0) {
      break;
    }
  }
  if (len) {
    if (negative) len--;
    if (rst.length < len) rst = "0".repeat(len - rst.length) + rst;
  }
  return negative ? "-" + rst : rst;
}

// base62解码
export function debase62(src: string): number {
  let rst = 0;
  const negative = src[0] === "-";
  if (negative) src = src.substr(1);
  for (let i = 0; i < src.length; i++) {
    const a = _BASE62_ST.indexOf(src[i]);
    if (a < 0) {
      continue;
    }
    rst = rst * 62 + a;
  }
  return negative ? -rst : rst;
}

export function paddingLeft(str: string, len: number) {
  if (str.length < len) {
    return "0".repeat(len - str.length) + str;
  } else if (str.length > len) {
    return str.substr(0, len);
  }
  return str;
}
