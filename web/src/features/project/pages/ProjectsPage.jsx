import { useGetProjectsQuery } from '../../../app/services/project';
import { EyeIcon } from '../../../icons/EyeIcon';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../../common/components/Button';
import { TrashIcon } from '../../../icons/TrashIcon';
import { useState } from 'react';
import { ProjectDeleteModal } from '../components/ProjectDeleteModal';

export const ProjectsPage = () => {
  const { data: projects } = useGetProjectsQuery();
  const navigate = useNavigate();
  const [deleleProjectId, setDeleteProjectId] = useState();

  return (
    <div className='px-4 w-full max-w-[1024px] mx-auto'>
      <Button onClick={() => navigate('/projects/create')} className='my-3'>
        new project
      </Button>
      <div class='overflow-x-auto relative border'>
        <table class='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead class='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' class='py-3 px-6'>
                Name
              </th>
              <th scope='col' class='py-3 px-6'>
                Url
              </th>
              <th scope='col' class='py-3 px-6'>
                Description
              </th>
              <th scope='col' class='py-3 px-6'>
                Category
              </th>
              <th scope='col' class='py-3 px-6'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {projects?.map((project, index) => (
              <tr
                class={`bg-white dark:bg-gray-800 dark:border-gray-700 ${
                  index !== projects.length - 1 ? 'border-b' : ''
                }`}
                index={index}
              >
                <th
                  scope='row'
                  class='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                >
                  {project.name}
                </th>
                <td class='py-4 px-6'>{project.url}</td>
                <td class='py-4 px-6'>{project.description}</td>
                <td class='py-4 px-6'>{project.category}</td>
                <td className='py-4 px-6 '>
                  <div className='flex w-full items-center gap-2'>
                    <Button
                      isIcon={true}
                      isTransparent={true}
                      onClick={() => {
                        navigate(`/projects/${project.id}/board`);
                      }}
                    >
                      {<EyeIcon />}
                    </Button>
                    <Button
                      isIcon={true}
                      isTransparent={true}
                      onClick={() => {
                        setDeleteProjectId(project.id);
                      }}
                    >
                      {<TrashIcon />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Outlet />
      </div>
      <ProjectDeleteModal
        projectId={deleleProjectId}
        setProjectId={setDeleteProjectId}
      />
    </div>
  );
};
