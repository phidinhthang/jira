import { useEffect, useState, useRef } from 'react';

export const Select = ({
  options,
  renderOption,
  onChange,
  handleSearch,
  children,
  value,
  className,
  closeOnChange = true,
  dropdownClassName = '',
}) => {
  const [searchText, setSearchText] = useState('');
  const [isOptionOpen, setOptionOpen] = useState(false);
  const selectRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);

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

  return (
    <div ref={selectRef} className={`relative bg-white ${className}`}>
      <div
        onClick={() => {
          setOptionOpen(true);
        }}
      >
        {children(selectedOption)}
      </div>
      {isOptionOpen && (
        <div
          className={`absolute bg-white left-0 top-full shadow-md z-10 ${dropdownClassName}`}
        >
          <input
            className='py-2 px-3 text-sm w-full focus:border-0 focus:outline-0'
            value={searchText}
            placeholder='Search'
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div>
            {options
              .filter((option) =>
                handleSearch ? handleSearch(option, searchText) : true
              )
              .map((option, index) => (
                <div
                  key={index}
                  onClick={() => {
                    onChange(option.value);
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
