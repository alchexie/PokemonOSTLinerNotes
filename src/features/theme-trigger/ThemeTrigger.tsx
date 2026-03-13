import { useTheme } from './hooks/useTheme';

export function ThemeTrigger() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button id="btn-theme" onClick={toggleTheme}>
      <img src={`${import.meta.env.BASE_URL}assets/images/ui/icons/theme/${theme}.svg`} />
    </button>
  );
}
