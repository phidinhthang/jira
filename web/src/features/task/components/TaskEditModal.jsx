import ReactModal from 'react-modal';
import { Select } from '../../common/components/Select';
import { StoryIcon } from '../../../icons/StoryIcon';
import { BugIcon } from '../../../icons/BugIcon';
import { TaskIcon } from '../../../icons/TaskIcon';
import { TrashIcon } from '../../../icons/TrashIcon';
import { MultipleSelect } from '../../common/components/MultipleSelect';
import { Avatar } from '../../common/components/Avatar';
import {
  useGetTaskQuery,
  useUpdateTaskMutation,
} from '../../../app/services/task';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../common/components/Button';
import { TimesIcon } from '../../../icons/TimesIcon';
import { Input } from '../../common/components/Input';
import ReactQuill from 'react-quill';
import { useGetUsersQuery } from '../../../app/services/user';
import { ArrowUpIcon } from '../../../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../../../icons/ArrowDownIcon';
import { TaskDeleteModal } from './TaskDeleteModal';
import { Progress } from '../../common/components/Progress';
import { ClockIcon } from '../../../icons/ClockIcon';
import { TimeTrackingModal } from './TimeTrackingModal';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const priorityIconMap = {
  highest: <ArrowUpIcon className='text-[#CD272D]' />,
  high: <ArrowUpIcon className='text-[#E94F51]' />,
  medium: <ArrowUpIcon className='text-[#E97F33]' />,
  low: <ArrowDownIcon className='text-[#74B08D]' />,
  lowest: <ArrowDownIcon className='text-[#62AB68]' />,
};

export const TaskEditModal = () => {
  const params = useParams();
  const taskId = params.taskId;
  const projectId = params.projectId;
  const { data: task } = useGetTaskQuery(taskId);
  const [type, setType] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [status, setStatus] = useState();
  const [reporter, setReporter] = useState();
  const [assignees, setAssignees] = useState([]);
  const [priority, setPriority] = useState();
  const [estimatedTime, setEstimatedTime] = useState();
  const [spentTime, setSpentTime] = useState();
  const [remainingTime, setRemainingTime] = useState();
  const { data: users } = useGetUsersQuery();
  const [updateTask] = useUpdateTaskMutation();
  const [isDeleteTaskModalOpen, setDeleteTaskModalOpen] = useState(false);
  const [isShowTimeTrackingModal, setShowTimeTrackingModal] = useState(false);
  const userOptions = users ? users.map((u) => ({ value: u.id, data: u })) : [];
  const [isShowDescriptionEditor, setShowDescriptionEditor] = useState(false);

  console.log('update task ', task);

  const timeTrackingValue =
    (spentTime
      ? remainingTime
        ? spentTime / (spentTime + remainingTime)
        : estimatedTime
        ? spentTime / estimatedTime
        : 1
      : 0) * 100;

  useEffect(() => {
    if (!task) return;
    setType(task.type);
    setName(task.name);
    setDescription(task.description);
    setStatus(task.status);
    setAssignees(() => task.assignees.map((assignee) => assignee.id));
    setEstimatedTime(task.estimatedTime);
    setSpentTime(task.spentTime);
    setRemainingTime(task.remainingTime);
    setReporter(() => task.reporter.id);
    // }
    setPriority(task.priority);
  }, [task]);

  const navigate = useNavigate();

  if (!task) {
    return <></>;
  }

  return (
    <ReactModal
      className='w-full my-10 mx-auto max-w-[960px] focus:outline-0 focus:border-0'
      overlayClassName='fixed top-0 left-0 right-0 bg-gray-700/70 overflow-y-auto h-full'
      isOpen={true}
      onRequestClose={() => navigate(`/projects/${projectId}/board`)}
    >
      <div className='px-4 py-6 bg-white'>
        <div className='flex justify-between items-center'>
          <div>
            <Select
              options={[
                {
                  value: 'task',
                  data: { label: 'Task', icon: <TaskIcon /> },
                },
                { value: 'bug', data: { label: 'Bug', icon: <BugIcon /> } },
                {
                  value: 'story',
                  data: { label: 'Story', icon: <StoryIcon /> },
                },
              ]}
              dropdownClassName='right-0 mx-[1px]'
              value={type}
              handleSearch={(option, searchText) => {
                if (
                  option.data.label
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
                ) {
                  return true;
                }
                return false;
              }}
              onChange={(value) => {
                setType(value);
                updateTask({
                  id: taskId,
                  type: value,
                  projectId,
                });
              }}
              renderOption={(option) => (
                <div className='px-3 py-2 hover:bg-gray-200 flex gap-3 items-center'>
                  {option.data.icon}
                  <span>{option.data.label}</span>
                </div>
              )}
            >
              {(option) => (
                <div className='px-3 py-1 flex gap-3 items-center hover:bg-gray-200 cursor-pointer'>
                  {option.data.icon}
                  <span className='text-sm font-medium'>{`${option.data.label.toUpperCase()}-${taskId}`}</span>
                </div>
              )}
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              onClick={() => setDeleteTaskModalOpen(true)}
              isIcon
              isTransparent={true}
            >
              <TrashIcon width={24} height={24} />
            </Button>
            <Button
              isIcon={true}
              isTransparent
              onClick={() => navigate(`/projects/${projectId}/board`)}
            >
              <TimesIcon width={24} height={24} />
            </Button>
          </div>
        </div>
        <div className='mt-5 flex gap-3 justify-between'>
          <div className='w-3/5 p-4'>
            <div className='mb-3 -mx-2'>
              <Input
                className='border-0 focus-within:ring-2 font-medium text-xl focus-within:!bg-white hover:bg-gray-200 h-full py-2'
                hasError={!name}
                isTextarea={true}
                spellCheck={false}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  e.target.style.height = '5px';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                onBlur={() => {
                  if (name && task.name !== name) {
                    updateTask({
                      id: taskId,
                      projectId,
                      name,
                    });
                  }
                }}
              />
              {!name && (
                <p className='text-sm text-red-700 font-medium mx-2'>
                  This field is required!
                </p>
              )}
            </div>
            <div className='mb-3'>
              <span className='font-medium text-sm text-[#5e6c84] mb-1'>
                Description
              </span>
              {isShowDescriptionEditor ? (
                <div>
                  <ReactQuill
                    theme='snow'
                    value={description}
                    onChange={setDescription}
                  />
                  {!description && (
                    <p className='text-sm text-red-700 font-medium'>
                      This field is required!
                    </p>
                  )}
                  <div className='flex gap-1 mt-2'>
                    <Button
                      variant='primary'
                      onClick={() => {
                        if (description) {
                          updateTask({
                            id: taskId,
                            description,
                            projectId,
                          }).then(() => {
                            setShowDescriptionEditor(false);
                          });
                        }
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      isTransparent={true}
                      onClick={() => setShowDescriptionEditor(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: description }}
                  onClick={() => setShowDescriptionEditor(true)}
                ></div>
              )}
            </div>
          </div>
          <div className='w-2/5 p-4'>
            <div className='mb-3'>
              <label className='font-medium text-sm text-[#5e6c84]'>
                Status
              </label>
              <Select
                options={[
                  {
                    value: 'backlog',
                    data: { label: 'Backlog' },
                  },
                  {
                    value: 'selected_for_development',
                    data: { label: 'Selected for development' },
                  },
                  {
                    value: 'in_progress',
                    data: { label: 'In progress' },
                  },
                  {
                    value: 'done',
                    data: { label: 'Done' },
                  },
                ]}
                dropdownClassName='right-0 mx-[1px]'
                value={status}
                handleSearch={(option, searchText) => {
                  if (
                    option.data.label
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  ) {
                    return true;
                  }
                  return false;
                }}
                onChange={(value) => {
                  setStatus(value);
                  updateTask({
                    id: taskId,
                    status: value,
                    projectId,
                  });
                }}
                renderOption={(option) => (
                  <div className='px-3 py-2 hover:bg-gray-200 flex gap-3 items-center'>
                    <span>{option.data.label}</span>
                  </div>
                )}
              >
                {(option) => (
                  <div className='relative rounded-[4px] curosr-pointer text-sm inline-block'>
                    <div className='flex items-center'>
                      <div
                        className={`uppercase transition-all duration-100 inline-flex items-center rounded-[4px] cursor-pointer font-semibold select-none text-xs py-0 px-3 h-8 ${
                          option.value === 'backlog' ||
                          option.value === 'selected_for_development'
                            ? 'bg-[rgb(223,225,230)] text-[rbg(66,82,110)]'
                            : option.value === 'in_progress'
                            ? 'text-white bg-[rgb(0,82,204)]'
                            : 'text-white bg-[rgb(11,135,91)]'
                        }`}
                      >
                        <div>{option.data.label}</div>
                      </div>
                    </div>
                  </div>
                )}
              </Select>
            </div>
            <div className='mb-4'>
              <label className='font-medium text-sm text-[#5e6c84]'>
                Assignees
              </label>
              <MultipleSelect
                values={assignees}
                options={userOptions}
                renderOption={(option) => (
                  <div className='px-3 py-2 hover:bg-gray-200 flex gap-3 items-center'>
                    <Avatar src={option.data.avatar} />
                    <span className='text-sm'>{option.data.displayName}</span>
                  </div>
                )}
                onSelect={(value) => {
                  const updatedAssignees = [...assignees, value];
                  setAssignees(updatedAssignees);
                  updateTask({
                    id: taskId,
                    assigneeIds: updatedAssignees,
                    projectId,
                  });
                }}
                dropdownClassName='right-0'
              >
                {(options) => (
                  <div className='py-1 flex items-center flex-wrap '>
                    {options.length ? (
                      <div className='flex gap-1 flex-wrap'>
                        {options.map((option, index) => (
                          <div
                            key={index}
                            className='flex bg-gray-200 py-1 px-2 gap-2 items-center cursor-pointer'
                            onClick={() => {
                              const updatedAssignees = assignees.filter(
                                (assignee) => assignee !== option.value
                              );
                              setAssignees(updatedAssignees);
                              updateTask({
                                id: taskId,
                                assigneeIds: updatedAssignees,
                                projectId,
                              });
                            }}
                          >
                            <Avatar src={option.data.avatar} />
                            <span className='text-sm font-medium'>
                              {option.data.displayName}
                            </span>
                            <span>
                              <TimesIcon />
                            </span>
                          </div>
                        ))}
                        <span className='text-blue-600 hover:underline text-sm font-medium cursor-pointer mt-1'>
                          Add more
                        </span>
                      </div>
                    ) : (
                      <div className='py-1 text-sm'>Select</div>
                    )}
                  </div>
                )}
              </MultipleSelect>
            </div>
            <div className='mb-4'>
              <label className='font-medium text-sm text-[#5e6c84]'>
                Reporter
              </label>
              <Select
                options={userOptions}
                dropdownClassName='right-0 mx-[1px] pb-1'
                value={reporter}
                handleSearch={(option, searchText) => {
                  if (
                    option.data.displayName
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  ) {
                    return true;
                  }
                  return false;
                }}
                onChange={(value) => {
                  setReporter(value);
                  updateTask({
                    id: taskId,
                    reporterId: value,
                    projectId,
                  });
                }}
                renderOption={(option) => {
                  return (
                    <div className='px-3 py-2 hover:bg-gray-200 flex gap-3 items-center'>
                      <Avatar src={option.data.avatar} />
                      <span className='text-sm'>{option.data.displayName}</span>
                    </div>
                  );
                }}
              >
                {(option) => {
                  return (
                    <div className='border border-[rgb(179, 186, 197)] px-3 py-1 flex gap-3 items-center'>
                      {option ? (
                        <>
                          <Avatar src={option.data.avatar} />
                          <span className='text-sm font-medium'>
                            {option.data.displayName}
                          </span>
                        </>
                      ) : (
                        <span className='text-sm py-1'>
                          Choose one reporter
                        </span>
                      )}
                    </div>
                  );
                }}
              </Select>
            </div>
            <div className='mb-4'>
              <label className='font-medium text-sm text-[#5e6c84]'>
                Priority
              </label>
              <Select
                options={[
                  {
                    value: 'highest',
                    data: {
                      label: 'Highest',
                      icon: priorityIconMap['highest'],
                    },
                  },
                  {
                    value: 'high',
                    data: { label: 'Bug', icon: priorityIconMap['high'] },
                  },
                  {
                    value: 'medium',
                    data: {
                      label: 'Medium',
                      icon: priorityIconMap['medium'],
                    },
                  },
                  {
                    value: 'low',
                    data: { label: 'Low', icon: priorityIconMap['low'] },
                  },
                  {
                    value: 'lowest',
                    data: {
                      label: 'Lowest',
                      icon: priorityIconMap['lowest'],
                    },
                  },
                ]}
                dropdownClassName='right-0 mx-[1px]'
                value={priority}
                handleSearch={(option, searchText) => {
                  if (
                    option.data.label
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  ) {
                    return true;
                  }
                  return false;
                }}
                onChange={(value) => {
                  setPriority(value);
                  updateTask({
                    id: taskId,
                    priority: value,
                    projectId,
                  });
                }}
                renderOption={(option) => (
                  <div className='px-3 py-2 hover:bg-gray-200 flex gap-3 items-center'>
                    {option.data.icon}
                    <span>{option.data.label}</span>
                  </div>
                )}
              >
                {(option) => (
                  <div className='border border-[rgb(179, 186, 197)] px-3 py-1 flex gap-3 items-center'>
                    {option ? (
                      <>
                        {option.data.icon}
                        <span>{option.data.label}</span>
                      </>
                    ) : (
                      <span className='text-sm py-1'>Select</span>
                    )}
                  </div>
                )}
              </Select>
            </div>
            <div className='mb-4'>
              <span className='font-medium text-sm text-[#5e6c84] mb-1'>
                Original Estimate (Hours)
              </span>
              <div>
                <Input
                  placeholder='Number'
                  value={estimatedTime}
                  onChange={(e) => {
                    const estimatedTime =
                      parseInt(e.target.value.replace(/\D/, ''), 10) || null;
                    setEstimatedTime(estimatedTime);
                    updateTask({
                      id: taskId,
                      estimatedTime,
                    });
                  }}
                  onBlur={(e) => {}}
                />
              </div>
            </div>
            <div className='mb-4'>
              <span className='font-medium text-sm text-[#5e6c84]'>
                Time tracking (Hours)
              </span>
              <div
                className='flex gap-3 mt-1 hover:bg-gray-200 p-1 rounded-sm cursor-pointer'
                onClick={() => setShowTimeTrackingModal(true)}
              >
                <div className='text-[#5e6c84]'>
                  <ClockIcon width={24} height={24} />
                </div>
                <div className='flex-grow'>
                  <Progress value={timeTrackingValue} task={task} />
                </div>
              </div>
            </div>
            <div className='border-t border-gray-300 text-sm text-gray-600 font-medium'>
              <div className='mt-3'>
                Created at {dayjs(task.createdAt).fromNow()}
              </div>
              <div className='mt-1'>
                Updated at {dayjs(task.updatedAt).fromNow()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <TaskDeleteModal
        isOpen={isDeleteTaskModalOpen}
        setOpen={setDeleteTaskModalOpen}
        taskId={taskId}
      />
      <TimeTrackingModal
        isOpen={isShowTimeTrackingModal}
        setOpen={setShowTimeTrackingModal}
        task={task}
      />
    </ReactModal>
  );
};
