import PropTypes from 'prop-types';
import { BugIcon } from '../../../icons/BugIcon';
import { StoryIcon } from '../../../icons/StoryIcon';
import { TaskIcon } from '../../../icons/TaskIcon';
import { ArrowUpIcon } from '../../../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../../../icons/ArrowDownIcon';
import { Avatar, AvatarList } from '../../common/components/Avatar';
import { Draggable } from 'react-beautiful-dnd';
import { ExclaimationIcon } from '../../../icons/ExclaimationIcon';

const taskTypeIconMap = {
  task: <TaskIcon />,
  bug: <BugIcon />,
  story: <StoryIcon />,
};

const priorityIconMap = {
  highest: <ArrowUpIcon className='text-[#CD272D]' />,
  high: <ArrowUpIcon className='text-[#E94F51]' />,
  medium: <ArrowUpIcon className='text-[#E97F33]' />,
  low: <ArrowDownIcon className='text-[#74B08D]' />,
  lowest: <ArrowDownIcon className='text-[#62AB68]' />,
};

export const BoardItem = ({ task, index, onClick }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          snapshot={snapshot}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          className='select-none bg-white shadow-md p-2 mt-2 hover:bg-gray-200'
          onClick={onClick}
        >
          <div className='mb-3 text-[14.5px]'>{task.name}</div>
          <div className='flex justify-between items-center'>
            <div className='flex gap-1 items-center'>
              <div>{taskTypeIconMap[task.type]}</div>
              <div>{priorityIconMap[task.priority]}</div>
              {task.hasExpired && (
                <ExclaimationIcon
                  width={24}
                  height={24}
                  className='text-yellow-500'
                />
              )}
            </div>
            <div className='flex gap-1'>
              <AvatarList users={task.assignees || []} />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

BoardItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.oneOf(['task', 'bug', 'story']),
    status: PropTypes.oneOf([
      'backlog',
      'selected_for_development',
      'in_progress',
      'done',
    ]),
    priority: PropTypes.oneOf(['lowest', 'low', 'medium', 'high', 'highest']),
    assignees: PropTypes.arrayOf(
      PropTypes.shape({
        avatar: PropTypes.string,
      })
    ),
  }),
  index: PropTypes.number,
};
