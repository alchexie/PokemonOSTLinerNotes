import { useTheme } from './hooks/useTheme';
import lightIcon from '@/assets/icons/light.svg';
import darkIcon from '@/assets/icons/dark.svg';

export function ThemeTrigger() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button id="btn-theme" onClick={toggleTheme}>
      <img src={theme === 'light' ? lightIcon : darkIcon} />
    </button>
  );
}
