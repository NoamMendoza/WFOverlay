import { createState } from "ags";

export type Theme = "theme-dark" | "theme-light";

const [theme, setThemeState] = createState<Theme>("theme-dark");

export const themeAccessor = theme;

export function setTheme(value: Theme) {
  setThemeState(value);
}

export function toggleTheme() {
  setThemeState(theme.get() === "theme-dark" ? "theme-light" : 'theme-dark');
}
