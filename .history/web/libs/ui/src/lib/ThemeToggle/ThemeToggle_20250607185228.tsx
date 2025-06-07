import { clsx } from "clsx";
import styles from "./ThemeToggle.module.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ReactComponent as Sun } from "./icons/sun.svg";
import { ReactComponent as Moon } from "./icons/moon.svg";
import { Badge } from "@humansignal/ui";
import { atom, useSetAtom } from "jotai";

interface ThemeToggleProps {
  className?: string;
}

const THEME_OPTIONS = ["自动", "浅色", "深色"];
const PREFERRED_COLOR_SCHEME_KEY = "preferred-color-scheme";

export const getCurrentTheme = () => {
  const themeSelection = window.localStorage.getItem(PREFERRED_COLOR_SCHEME_KEY) ?? THEME_OPTIONS[0];
  return themeSelection === THEME_OPTIONS[0]
    ? window.matchMedia && window.matchMedia("(prefers-color-scheme: 深色)").matches
      ? "深色"
      : "浅色"
    : themeSelection;
};
export const themeAtom = atom<string>(getCurrentTheme());
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const presetTheme = window.localStorage.getItem(PREFERRED_COLOR_SCHEME_KEY) ?? THEME_OPTIONS[1];
  const [theme, setTheme] = useState(presetTheme);
  const systemMode = useMemo(
    () => (window.matchMedia && window.matchMedia("(prefers-color-scheme: 深色)").matches ? "深色" : "浅色"),
    [],
  );
  const [appliedTheme, setAppliedTheme] = useState(presetTheme === "自动" ? systemMode : presetTheme);
  const setThemeAtom = useSetAtom(themeAtom);

  useEffect(() => {
    if (!appliedTheme) return;
    document.documentElement.setAttribute("data-color-scheme", appliedTheme.toLowerCase());
  }, [appliedTheme]);

  const themeChanged = useCallback(() => {
    const length = THEME_OPTIONS.length;
    const index = (THEME_OPTIONS.indexOf(theme) + 1) % length;
    const nextTheme = THEME_OPTIONS[index];

    window.localStorage.setItem(PREFERRED_COLOR_SCHEME_KEY, nextTheme);
    setTheme(nextTheme);
    const newTheme = nextTheme === "自动" ? systemMode : nextTheme;
    setAppliedTheme(newTheme);
    setThemeAtom(newTheme);
  }, [theme]);

  const themeLabel = useMemo(
    () => THEME_OPTIONS.find((option) => option.toLowerCase() === theme.toLowerCase()),
    [theme],
  );

  return (
    <button
      className={clsx(styles.themeToggle, className, {
        [styles.深色]: appliedTheme === "深色",
        [styles.浅色]: appliedTheme === "浅色",
      })}
      onClick={themeChanged}
      type="button"
    >
      <div className={clsx(styles.themeToggle__icon)}>
        <div className={clsx(styles.animationWrapper)}>
          <Moon className={clsx(styles.moon)} />
          <Sun className={clsx(styles.sun)} />
        </div>
      </div>
      <span className={clsx(styles.themeToggle__label)}>{themeLabel}</span>
      <Badge variant="beta" className={styles.betaBadge}>
        测试
      </Badge>
    </button>
  );
};

export default ThemeToggle;
