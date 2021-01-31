export function delay(d = Math.random() * 500) {
  return new Promise(resolve => setTimeout(() => resolve(d), d));
}

export * from "./jwt";
