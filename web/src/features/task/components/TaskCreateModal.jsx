import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import ReactModal from 'react-modal';
import { Select } from '../../common/components/Select';
import { TaskIcon } from '../../../icons/TaskIcon';
import { Input } from '../../common/components/Input';
import { StoryIcon } from '../../../icons/StoryIcon';
import { MultipleSelect } from '../../common/components/MultipleSelect';
import { BugIcon } from '../../../icons/BugIcon';
import { useGetUsersQuery } from '../../../app/services/user';
import { ArrowUpIcon } from '../../../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../../../icons/ArrowDownIcon';
import { Button } from '../../common/components/Button';
import { Avatar } from '../../common/components/Avatar';
import { TimesIcon } from '../../../icons/TimesIcon';
import ReactQuill from 'react-quill';
import { useCreateTaskMutation } from '../../../app/services/task';

const priorityIconMap = {
  highest: <ArrowUpIcon className='text-[#CD272D]' />,
  high: <ArrowUpIcon className='text-[#E94F51]' />,
  medium: <ArrowUpIcon className='text-[#E97F33]' />,
  low: <ArrowDownIcon className='text-[#74B08D]' />,
  lowest: <ArrowDownIcon className='text-[#62AB68]' />,
};

export const TaskCreateModal = () => {
  const [type, setType] = useState('task');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [reporterId, setReporterId] = useState();
  const [assignees, setAssignees] = useState([]);
  const [priority, setPriority] = useState();
  const params = useParams();
  const navigate = useNavigate();
  const projectId = params.projectId;

  const { data: users } = useGetUsersQuery();
  const [createTask] = useCreateTaskMutation();
  const userOptions = users ? users.map((u) => ({ value: u.id, data: u })) : [];

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={() => {
        navigate(`/projects/${projectId}/board`);
      }}
      className='w-full my-10 mx-auto max-w-[900px]'
      overlayClassName='fixed top-0 left-0 right-0 bg-gray-700/70 overflow-y-auto h-full'
    >
      <div className='p-10 pt-8 bg-white'>
        <h4 className='font-medium! text-2xl mb-8'>Create issue</h4>
        <div className='mb-4'>
          <label className='font-medium text-sm text-[#5e6c84]'>
            Issue Type
          </label>
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
              <div className='border border-[rgb(179, 186, 197)] px-3 py-1 flex gap-3 items-center'>
                {option.data.icon}
                <span>{option.data.label}</span>
              </div>
            )}
          </Select>
          <span className='text-xs text-[#5e6c84] font-medium'>
            Start typing to get a list of possible matches.
          </span>
        </div>
        <div className='mb-4'>
          <label className='font-medium text-sm text-[#5e6c84]'>
            Short Summary
          </label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <span className='text-xs text-[#5e6c84] font-medium'>
            Concisely summarize the issue in one or two sentences.
          </span>
        </div>
        <div className='mb-4'>
          <label className='font-medium text-sm text-[#5e6c84]'>
            Description
          </label>
          <ReactQuill
            theme='snow'
            value={description}
            onChange={setDescription}
          />
          <span className='text-xs text-[#5e6c84] font-medium'>
            Describe the issue in as much detail as you'd like.
          </span>
        </div>
        <div className='mb-4'>
          <label className='font-medium text-sm text-[#5e6c84]'>Reporter</label>
          <Select
            options={userOptions}
            dropdownClassName='right-0 mx-[1px] pb-1'
            value={reporterId}
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
              setReporterId(value);
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
                      <span className='text-sm'>{option.data.displayName}</span>
                    </>
                  ) : (
                    <span className='text-sm py-1'>Choose one reporter</span>
                  )}
                </div>
              );
            }}
          </Select>
          <span className='text-xs text-[#5e6c84] font-medium'>
            Start typing to get a list of possible matches.
          </span>
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
              <div className='py-2 px-3 border border-gray-200'>
                {options.length ? (
                  <div className='flex gap-2'>
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className='flex gap-2 items-center cursor-pointer'
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
                    <span className='text-blue-600 hover:underline text-sm font-medium cursor-pointer mt-[2px]'>
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
          <label className='font-medium text-sm text-[#5e6c84]'>Priority</label>
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
                data: { label: 'High', icon: priorityIconMap['high'] },
              },
              {
                value: 'medium',
                data: { label: 'Medium', icon: priorityIconMap['medium'] },
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
          <span className='text-xs text-[#5e6c84] font-medium'>
            Priority in relation to other issues.
          </span>
        </div>
        <Button
          variant='primary'
          onClick={() => {
            createTask({
              projectId,
              type,
              name,
              description,
              reporterId: reporterId,
              assigneeIds: assignees,
              priority,
            }).then(() => navigate(`/projects/${projectId}/board`));
          }}
        >
          Create
        </Button>
      </div>
    </ReactModal>
  );
};
