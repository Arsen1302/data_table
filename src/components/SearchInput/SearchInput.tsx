import { type ChangeEvent, type FC, useEffect, useState } from 'react';

import { useDebouncedCallback } from '@/hooks';

const DEBOUNCE_MS = 400;

interface SearchInputProps {
  value: string;
  placeholder: string;
  isBusy: boolean;
  onChange: (value: string) => void;
}

export const SearchInput: FC<SearchInputProps> = (props) => {
  const { value, placeholder, isBusy, onChange } = props;

  const [text, setText] = useState(value);

  const { debounced: debouncedChange, cancel: cancelPendingChange } = useDebouncedCallback(
    onChange,
    DEBOUNCE_MS,
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    debouncedChange(event.target.value);
  };

  useEffect(() => {
    cancelPendingChange();
    setText(value);
  }, [value, cancelPendingChange]);

  return (
    <div className="relative w-72">
      <input
        type="search"
        className="w-full rounded-lg border border-slate-300 px-3 py-1.5 pr-9 text-sm placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900"
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
      />
      {isBusy && (
        <span className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600 dark:border-slate-600 dark:border-t-slate-300" />
      )}
    </div>
  );
};
