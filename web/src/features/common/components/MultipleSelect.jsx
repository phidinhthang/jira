import { useEffect, useState, useRef } from 'react';

export const MultipleSelect = ({
  options,
  renderOption,
  onSelect,
  handleSearch,
  children,
  values = [],
  className,
  closeOnChange = true,
  dropdownClassName = '',
}) => {
  const [searchText, setSearchText] = useState('');
  const [isOptionOpen, setOptionOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && selectRef.current.contains(e.target)) {
      } else {
        setOptionOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => window.removeEventListener('click', handleClickOutside);
  }, [selectRef]);

  const selectedOptions = values
    .map((value) => options.find((o) => o.value === value))
    .filter(Boolean);

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <div
        onClick={() => {
          setOptionOpen(true);
        }}
      >
        {children(selectedOptions)}
      </div>
      {isOptionOpen && (
        <div
          className={`absolute left-0 top-full shadow-md z-10 bg-white ${dropdownClassName}`}
        >
          <input
            className='py-2 px-3 text-sm w-full'
            value={searchText}
            placeholder='Search'
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div>
            {options
              .filter((option) => !values.includes(option.value))
              .filter((option) =>
                handleSearch ? handleSearch(option, searchText) : true
              )
              .map((option, index) => (
                <div
                  key={index}
                  onClick={() => {
                    onSelect(option.value);
                    if (closeOnChange) {
                      setOptionOpen(false);
                    }
                  }}
                >
                  {renderOption(option)}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
