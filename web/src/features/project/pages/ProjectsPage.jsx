import { useGetProjectsQuery } from '../../../app/services/project';
import { EyeIcon } from '../../../icons/EyeIcon';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../../common/components/Button';

export const ProjectsPage = () => {
  const { data: projects } = useGetProjectsQuery();
  const navigate = useNavigate();

  return (
    <div>
      <Button onClick={() => navigate('/projects/create')}>new project</Button>
      <div class='overflow-x-auto relative'>
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
                class='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
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
                  <div className='flex w-full items-center'>
                    <span
                      className='cursor-pointer'
                      onClick={() => {
                        navigate(`/projects/${project.id}/board`);
                      }}
                    >
                      {<EyeIcon />}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Outlet />
      </div>
    </div>
  );
};
