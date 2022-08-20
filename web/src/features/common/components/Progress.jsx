export const Progress = ({ value }) => {
  let realValue = typeof value === 'number' ? value : 0;
  return (
    <div className='w-full bg-gray-300 rounded-[3px] h-[6px] overflow-hidden'>
      <div
        className='bg-blue-600 h-full transition-width duration-300 rounded-[3px]'
        style={{ width: `${realValue}%` }}
      ></div>
    </div>
  );
};
