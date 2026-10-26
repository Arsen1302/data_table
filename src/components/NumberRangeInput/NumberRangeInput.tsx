import { type ChangeEvent, type FC, type KeyboardEvent, useEffect, useState } from 'react';

interface NumberRange {
  min?: number;
  max?: number;
}

interface NumberRangeInputProps {
  value: NumberRange;
  placeholder: NumberRange;
  onChange: (value: NumberRange) => void;
}

const parseBound = (text: string): number | undefined => {
  const value = Number(text);

  return text && Number.isFinite(value) && value > 0 ? value : undefined;
};

const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    event.currentTarget.blur();
  }
};

const inputClassName =
  'w-32 rounded-lg border border-slate-300 px-3 py-1.5 text-sm placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900';

export const NumberRangeInput: FC<NumberRangeInputProps> = (props) => {
  const { value, placeholder, onChange } = props;

  const [minText, setMinText] = useState(value.min?.toString() ?? '');
  const [maxText, setMaxText] = useState(value.max?.toString() ?? '');

  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMinText(event.target.value);
  };

  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMaxText(event.target.value);
  };

  const handleOnBlur = () => {
    const isUnchanged =
      minText === (value.min?.toString() ?? '') && maxText === (value.max?.toString() ?? '');
    if (isUnchanged) {
      return;
    }
    onChange({ min: parseBound(minText), max: parseBound(maxText) });
  };

  useEffect(() => {
    setMinText(value.min?.toString() ?? '');
    setMaxText(value.max?.toString() ?? '');
  }, [value.min, value.max]);

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        inputMode="numeric"
        min={0}
        className={inputClassName}
        placeholder={`от ${placeholder.min?.toLocaleString('ru-RU') ?? ''}`}
        value={minText}
        onChange={handleMinChange}
        onBlur={handleOnBlur}
        onKeyDown={handleKeyDown}
      />
      <span className="text-slate-400">—</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        className={inputClassName}
        placeholder={`до ${placeholder.max?.toLocaleString('ru-RU') ?? ''}`}
        value={maxText}
        onChange={handleMaxChange}
        onBlur={handleOnBlur}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
