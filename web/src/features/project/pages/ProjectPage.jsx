import 'react-quill/dist/quill.snow.css';
import { Sidebar } from '../components/Sidebar';
import { Outlet, useParams } from 'react-router-dom';

export const ProjectPage = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <Outlet />
    </div>
  );
};
