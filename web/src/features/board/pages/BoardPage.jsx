import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { BoardItem } from '../../../features/board/components/BoardItem';
import { BoardList } from '../../../features/board/components/BoardList';
import { DragDropContext } from 'react-beautiful-dnd';
import {
  useCreateTaskMutation,
  useGetTasksQuery,
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
import { Avatar, AvatarList } from '../../../features/common/components/Avatar';
import { ArrowUpIcon } from '../../../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../../../icons/ArrowDownIcon';
import { MultipleSelect } from '../../../features/common/components/MultipleSelect';
import { TimesIcon } from '../../../icons/TimesIcon';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { elementType } from 'prop-types';
import { Button } from '../../common/components/Button';
import { AssigneesModal } from '../../task/components/AssigneesModal';

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
  const [searchText, setSearchText] = useState('');
  const projectId = params.projectId;
  const { data: project } = useGetProjectQuery(projectId);
  const { data: rawTasks } = useGetTasksQuery(projectId);
  const [filteredAssignees, setFilteredAssignees] = useState([]);
  const [updateTask, { isLoading }] = useUpdateTaskMutation();
  const [isAssigneesModalOpen, setAssigneesModalOpen] = useState(false);
  const [showExpiredTask, setShowExpiredTask] = useState(false);
  const { data: users } = useGetUsersQuery();
  const tasks = rawTasks?.map((task) => ({
    ...task,
    hasExpired:
      task.estimatedTime &&
      !task.spentTime &&
      new Date(task.createdAt).getTime() + task.estimatedTime * 60 * 60 * 1000 <
        Date.now(),
  }));
  const filteredTasks = tasks
    ?.filter((task) => {
      if (showExpiredTask) {
        return task.hasExpired;
      }
      return true;
    })
    ?.filter((task) => task.name.includes(searchText))
    ?.filter((task) => {
      if (!filteredAssignees.length) return true;
      const assigneeIds = task.assignees.map((assignee) => assignee.id);
      return assigneeIds.some((assigneeId) =>
        filteredAssignees.includes(assigneeId)
      );
    });

  console.log('filtered tasks ', filteredTasks);
  const taskByStatus = filteredTasks?.reduce(
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

  const highlightUser = (user) => {
    const checked = filteredAssignees.includes(user.id);
    return checked;
  };

  const onUserClick = (user) => {
    const checked = filteredAssignees.includes(user.id);
    if (checked) {
      setFilteredAssignees((assignees) =>
        assignees.filter((assignee) => assignee !== user.id)
      );
    } else {
      setFilteredAssignees((assignees) => [...assignees, user.id]);
    }
  };

  if (!taskByStatus || !project) {
    return <div>loading</div>;
  }

  return (
    <div className='h-screen flex-grow overflow-y-auto px-10'>
      <div className='mt-5'>
        <div className='text-[rgb(94,108,132)] text-[15px] font-medium'>
          Projects
          <span className='mx-2 text-lg'>/</span>
          {project.name}
          <span className='mx-2 text-lg'>/</span>
          Kanban board
        </div>
        <h1 className='font-semibold text-2xl'>Kanban Board</h1>
      </div>
      <div className='flex items-center mt-4'>
        <Input
          placeholder='Search...'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className='ml-4 flex gap-1'>
          <AvatarList
            users={users || []}
            liftUpOnHover
            size='lg'
            avatarClassname='cursor-pointer'
            isHighlight={highlightUser}
            onAvatarClick={onUserClick}
            limit={5}
            onShowMore={() => setAssigneesModalOpen(true)}
          />
        </div>
        <div className='ml-4'>
          <Button
            className={`${
              showExpiredTask
                ? 'bg-[#D2E5FE] hover:bg-[#D2E5FE] text-[#6557CC]'
                : ''
            }`}
            onClick={() => setShowExpiredTask((show) => !show)}
          >
            Expired Task
          </Button>
        </div>
      </div>
      <DragDropContext
        onDragEnd={(result) => {
          const updatedStatus = result.destination.droppableId;
          const updatedTask =
            taskByStatus[result.source.droppableId][result.source.index];
          if (result.destination.droppableId === result.source.droppableId) {
            if (result.destination.index === 0) {
              updateTask({
                id: updatedTask.id,
                projectId,
                index:
                  taskByStatus[result.destination.droppableId][0].index / 2,
                status: updatedStatus,
              });
            } else if (
              result.destination.index ===
              taskByStatus[result.destination.droppableId].length - 1
            ) {
              updateTask({
                id: updatedTask.id,
                projectId,
                index:
                  taskByStatus[result.destination.droppableId][
                    taskByStatus[result.destination.droppableId].length - 1
                  ].index + 1,
                status: updatedStatus,
              });
            } else {
              if (result.source.index > result.destination.index) {
                updateTask({
                  id: updatedTask.id,
                  projectId,
                  index:
                    (taskByStatus[result.destination.droppableId][
                      result.destination.index
                    ].index +
                      taskByStatus[result.destination.droppableId][
                        result.destination.index - 1
                      ].index) /
                    2,
                  status: updatedStatus,
                });
              } else if (result.source.index < result.destination.index) {
                updateTask({
                  id: updatedTask.id,
                  projectId,
                  index:
                    (taskByStatus[result.destination.droppableId][
                      result.destination.index
                    ].index +
                      taskByStatus[result.destination.droppableId][
                        result.destination.index + 1
                      ].index) /
                    2,
                  status: updatedStatus,
                });
              }
            }
          } else {
            if (result.destination.index === 0) {
              updateTask({
                id: updatedTask.id,
                projectId,
                index:
                  (taskByStatus[result.destination.droppableId]?.[0]?.index ??
                    2) / 2,
                status: updatedStatus,
              });
            } else if (
              result.destination.index ===
              taskByStatus[result.destination.droppableId].length
            ) {
              updateTask({
                id: updatedTask.id,
                projectId,
                index:
                  taskByStatus[result.destination.droppableId][
                    taskByStatus[result.destination.droppableId].length - 1
                  ].index + 1,
                status: updatedStatus,
              });
            } else {
              updateTask({
                id: updatedTask.id,
                projectId,
                index:
                  (taskByStatus[result.destination.droppableId][
                    result.destination.index
                  ].index +
                    taskByStatus[result.destination.droppableId][
                      result.destination.index - 1
                    ].index) /
                  2,
                status: updatedStatus,
              });
            }
          }
        }}
      >
        <div className='flex py-6 flex-wrap -mx-1'>
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
      <AssigneesModal
        highlightUser={highlightUser}
        isOpen={isAssigneesModalOpen}
        setOpen={setAssigneesModalOpen}
        onUserSelected={onUserClick}
        users={users || {}}
      />
    </div>
  );
};
