// frontend/src/components/Keyboard.tsx
import React, { useCallback, useEffect } from 'react';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  keyStatuses: Record<string, 'correct' | 'present' | 'absent' | undefined>;
}

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫']
];

const Keyboard: React.FC<KeyboardProps> = ({ 
  onKeyPress, 
  onEnter, 
  onBackspace,
  keyStatuses,
}) => {
  const handleKeyClick = (key: string) => {
    if (key === 'Enter') {
      onEnter();
    } else if (key === '⌫') {
      onBackspace();
    } else {
      onKeyPress(key);
    }
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    if (/^[a-z]$/.test(key)) {
      onKeyPress(key);
    } else if (key === 'enter') {
      onEnter();
    } else if (key === 'backspace' || key === 'delete') {
      onBackspace();
    }
  }, [onKeyPress, onEnter, onBackspace]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const getKeyClass = (key: string) => {
    if (key === 'Enter' || key === '⌫') {
      return 'keyboard-key font-semibold px-2 sm:px-3';
    }

    const status = keyStatuses[key];
    let className = 'keyboard-key';

    if (status === 'correct') {
      className += ' keyboard-key-correct';
    } else if (status === 'present') {
      className += ' keyboard-key-present';
    } else if (status === 'absent') {
      className += ' keyboard-key-absent';
    }

    return className;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 my-1">
          {row.map((key) => (
            <button
              key={key}
              className={getKeyClass(key)}
              onClick={() => handleKeyClick(key)}
              style={{ 
                width: key === 'Enter' || key === '⌫' ? '45px' : '30px',
                minWidth: key === 'Enter' || key === '⌫' ? '45px' : '30px'
              }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
