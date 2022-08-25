import ReactQuill from 'react-quill';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  useGetProjectQuery,
  useUpdateProjectMutation,
} from '../../../app/services/project';
import { Input } from '../../common/components/Input';
import { Button } from '../../common/components/Button';
import { Select } from '../../common/components/Select';

export const ProjectEditPage = () => {
  const params = useParams();
  const projectId = params.projectId;
  const { data: project } = useGetProjectQuery(projectId);
  const [description, setDescription] = useState();
  const [category, setCategory] = useState();
  const [url, setUrl] = useState();
  const [name, setName] = useState();
  const [updateProject] = useUpdateProjectMutation();

  useEffect(() => {
    if (project) {
      setDescription(project.description);
      setCategory(project.category);
      setUrl(project.url);
      setName(project.name);
    }
  }, [project]);
  return (
    <div className='w-full px-4'>
      <div className='w-full max-w-[640px] mx-auto mt-6'>
        <h4 className='font-medium text-2xl mb-8'>Project Details</h4>
        <div className='mb-3'>
          <label className='font-medium text-sm text-[#5e6c84]'>Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className='mb-3'>
          <label className='font-medium text-sm text-[#5e6c84]'>URL</label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className='mb-3'>
          <label className='font-medium text-sm text-[#5e6c84]'>
            Description
          </label>
          <ReactQuill
            theme='snow'
            value={description}
            onChange={setDescription}
          />
          <span className='text-xs text-[#5e6c84] font-medium'>
            Describe the project in as much detail as you'd like.
          </span>
        </div>
        <div className='mb-3'>
          <label className='font-medium text-sm text-[#5e6c84]'>
            Project Category
          </label>
          <Select
            options={[
              {
                value: 'software',
                data: {
                  label: 'Software',
                },
              },
              {
                value: 'marketing',
                data: { label: 'Marketing' },
              },
              {
                value: 'business',
                data: { label: 'Business' },
              },
            ]}
            dropdownClassName='right-0 mx-[1px]'
            value={category}
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
              setCategory(value);
            }}
            renderOption={(option) => (
              <div className='px-3 py-2 hover:bg-gray-200 flex gap-3 items-center'>
                <span>{option.data.label}</span>
              </div>
            )}
          >
            {(option) => (
              <div className='border border-[rgb(179, 186, 197)] px-3 py-1 flex gap-3 items-center'>
                {option ? (
                  <>
                    <span>{option.data.label}</span>
                  </>
                ) : (
                  <span className='text-sm py-1'>Select</span>
                )}
              </div>
            )}
          </Select>
        </div>
        <Button
          variant='primary'
          onClick={() => {
            updateProject({ id: projectId, url, name, description, category });
          }}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
};
