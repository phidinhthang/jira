import ReactModal from 'react-modal';
import { Select } from '../../common/components/Select';
import { StoryIcon } from '../../../icons/StoryIcon';
import { BugIcon } from '../../../icons/BugIcon';
import { TaskIcon } from '../../../icons/TaskIcon';
import { MultipleSelect } from '../../common/components/MultipleSelect';
import { Avatar } from '../../common/components/Avatar';
import { useGetTaskQuery } from '../../../app/services/task';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../common/components/Button';
import { TimesIcon } from '../../../icons/TimesIcon';
import { Input } from '../../common/components/Input';
import ReactQuill from 'react-quill';
import { useGetUsersQuery } from '../../../app/services/user';
import { ArrowUpIcon } from '../../../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../../../icons/ArrowDownIcon';

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
  const { data: users } = useGetUsersQuery();
  const userOptions = users ? users.map((u) => ({ value: u.id, data: u })) : [];
  const [isShowDescriptionEditor, setShowDescriptionEditor] = useState(false);

  useEffect(() => {
    if (!task) return;
    setType(task.type);
    setName(task.name);
    setDescription(task.description);
    setStatus(task.status);
    setAssignees(() => task.assignees.map((assignee) => assignee.id));
    setReporter(() => task.reporter.id);
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
          <div>
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
            <Input
              className='border-0 focus-within:ring-2 font-medium text-xl focus-within:!bg-white hover:bg-gray-200 h-full py-2 -mx-2 mb-3'
              isTextarea={true}
              spellCheck={false}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                e.target.style.height = '5px';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
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
                  <div className='flex gap-1 mt-2'>
                    <Button
                      type='primary'
                      onClick={() => console.log('description ', description)}
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
                    data: { label: 'Story' },
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
                }}
                renderOption={(option) => (
                  <div className='px-3 py-2 hover:bg-gray-200 flex gap-3 items-center'>
                    <span>{option.data.label}</span>
                  </div>
                )}
              >
                {(option) => (
                  <div className='border border-[rgb(179, 186, 197)] px-3 py-1 flex gap-3 items-center'>
                    <span>{option.data.label}</span>
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
                  setAssignees((assignees) => [...assignees, value]);
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
                              setAssignees((assignees) =>
                                assignees.filter(
                                  (assignee) => assignee !== option.value
                                )
                              );
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
                    data: { label: 'Story', icon: priorityIconMap['medium'] },
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
          </div>
        </div>
      </div>
    </ReactModal>
  );
};
