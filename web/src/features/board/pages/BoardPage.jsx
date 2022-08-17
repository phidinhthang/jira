import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { BoardItem } from '../../../features/board/components/BoardItem';
import { BoardList } from '../../../features/board/components/BoardList';
import { DragDropContext } from 'react-beautiful-dnd';
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from '../../../app/services/task';
import { useGetProjectQuery } from '../../../app/services/project';
import ReactModal from 'react-modal';
import { useState } from 'react';
import { Input } from '../../../features/common/components/Input';
import { Select } from '../../../features/common/components/Select';
import { StoryIcon } from '../../../icons/StoryIcon';
import { BugIcon } from '../../../icons/BugIcon';
import { TaskIcon } from '../../../icons/TaskIcon';
import { useGetUsersQuery } from '../../../app/services/user';
import { Avatar } from '../../../features/common/components/Avatar';
import { ArrowUpIcon } from '../../../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../../../icons/ArrowDownIcon';
import { MultipleSelect } from '../../../features/common/components/MultipleSelect';
import { TimesIcon } from '../../../icons/TimesIcon';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { elementType } from 'prop-types';
import { Button } from '../../common/components/Button';

const priorityIconMap = {
  highest: <ArrowUpIcon className='text-[#CD272D]' />,
  high: <ArrowUpIcon className='text-[#E94F51]' />,
  medium: <ArrowUpIcon className='text-[#E97F33]' />,
  low: <ArrowDownIcon className='text-[#74B08D]' />,
  lowest: <ArrowDownIcon className='text-[#62AB68]' />,
};

export const BoardPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const projectId = params.projectId;
  const { data } = useGetProjectQuery(projectId);
  const [updateTask, { isLoading }] = useUpdateTaskMutation();
  const taskByStatus = data?.tasks?.reduce(
    (acc, task) => {
      acc[task.status].push(task);
      return acc;
    },
    {
      backlog: [],
      selected_for_development: [],
      in_progress: [],
      done: [],
    }
  ) || {
    backlog: [],
    selected_for_development: [],
    in_progress: [],
    done: [],
  };
  ['backlog', 'selected_for_development', 'in_progress', 'done'].forEach(
    (status) => {
      taskByStatus[status].sort((a, b) => a.index - b.index);
    }
  );
  const [createTask, {}] = useCreateTaskMutation();

  if (!taskByStatus) {
    return <div>loading</div>;
  }

  return (
    <div className='h-screen flex-grow overflow-y-auto'>
      <DragDropContext
        onDragEnd={(result) => {
          const updatedTask =
            taskByStatus[result.source.droppableId][result.source.index];
          const upperTask =
            result.destination.index ===
            taskByStatus[result.destination.droppableId].length -
              Number(
                result.destination.droppableId === result.source.droppableId
              )
              ? result.destination.index + 1
              : taskByStatus[result.destination.droppableId][
                  result.destination.index
                ].index;
          const lowerTask =
            result.destination.index === 0
              ? 0
              : taskByStatus[result.destination.droppableId][
                  result.destination.index -
                    Number(
                      result.destination.droppableId !==
                        result.source.droppableId
                    )
                ].index;
          const updatedIndex = (upperTask + lowerTask) / 2;
          const updatedStatus = result.destination.droppableId;
          updateTask({
            id: updatedTask.id,
            index: updatedIndex,
            status: updatedStatus,
          });
        }}
      >
        <div className='flex gap-2 py-8 px-10'>
          {['backlog', 'selected_for_development', 'in_progress', 'done'].map(
            (status) => (
              <BoardList status={status} key={status}>
                {taskByStatus[status].map((task, index) => (
                  <BoardItem
                    index={index}
                    key={task.id}
                    task={task}
                    onClick={() => {
                      navigate(`/projects/${projectId}/board/tasks/${task.id}`);
                    }}
                  />
                ))}
              </BoardList>
            )
          )}
        </div>
      </DragDropContext>
      <Outlet />
    </div>
  );
};
