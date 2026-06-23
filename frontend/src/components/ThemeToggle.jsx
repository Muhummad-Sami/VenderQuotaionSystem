import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex items-center h-8 rounded-full w-14 transition-colors duration-300 focus:outline-none flex-shrink-0"
      style={{ backgroundColor: darkMode ? '#4F46E5' : '#CBD5E1' }}
      aria-label="Toggle theme"
    >
      <span
        className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 shadow-md flex items-center justify-center text-sm ${
          darkMode ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {darkMode ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

export default ThemeToggle;