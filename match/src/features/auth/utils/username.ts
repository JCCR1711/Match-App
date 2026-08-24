const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export const normalizeUsername = (value: string) =>
  value.trim().toLowerCase().replace(/^@+/, "").replace(/[^a-z0-9_]/g, "");

export const isValidUsername = (value: string) => USERNAME_PATTERN.test(value);
