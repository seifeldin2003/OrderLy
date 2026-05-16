export function isEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export function isRequired(value: string) {
  return value.trim().length > 0;
}
