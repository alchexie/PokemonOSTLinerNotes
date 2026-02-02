import { useTheme } from './hooks/useTheme';

export function ThemeTrigger() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button id="btn-theme" onClick={toggleTheme}>
      <img src={`/icons/${theme}.svg`} />
    </button>
  );
}
