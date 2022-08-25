import { Droppable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';

export const BoardList = ({ status, children }) => {
  const label = status.split('_').join(' ').toUpperCase();
  return (
    <div className='w-full md:w-1/2 lg:w-1/4 shrink-1 p-1'>
      <div className='bg-gray-100 p-2 flex flex-col h-full'>
        <h3 className='font-medium text-sm'>{label}</h3>
        <div className='flex-grow'>
          <Droppable droppableId={status}>
            {(provided) => (
              <div
                className='flex flex-col h-full min-h-[24px]'
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {children}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </div>
  );
};

BoardList.propTypes = {
  status: PropTypes.oneOf([
    'backlog',
    'selected_for_development',
    'in_progress',
    'done',
  ]),
};
