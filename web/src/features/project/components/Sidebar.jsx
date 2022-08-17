import { useNavigate, useParams } from 'react-router-dom';
import { BoardIcon } from '../../../icons/BoardIcon';
import { CogIcon } from '../../../icons/CogIcon';
import { FilterIcon } from '../../../icons/FilterIcon';
import { PaperIcon } from '../../../icons/PaperIcon';
import { PlusIcon } from '../../../icons/PlusIcon';
import { TruckIcon } from '../../../icons/TruckIcon';

const SidebarItem = ({ isActive, onClick, leftIcon, children }) => {
  return (
    <div
      className={`flex items-center gap-3 p-2 pb-3 bg-transparent hover:bg-gray-200 text-[15px] font-medium cursor-pointer rounded-[6px] ${
        isActive ? 'bg-blue-100 text-blue-500' : ''
      }`}
      onClick={onClick}
    >
      {leftIcon}
      {children}
    </div>
  );
};

export const Sidebar = () => {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.projectId;

  return (
    <div className='bg-gray-100 h-screen p-3 w-[220px]'>
      <div className='flex flex-col gap-1'>
        <SidebarItem
          isActive={true}
          leftIcon={<BoardIcon />}
          onClick={() => navigate(`/projects/${id}/board`)}
        >
          Kanban Board
        </SidebarItem>
        <SidebarItem
          leftIcon={<CogIcon />}
          onClick={() => navigate(`/projects/${id}/edit`)}
        >
          Project settings
        </SidebarItem>
        <SidebarItem
          leftIcon={<PlusIcon width={24} height={24} />}
          onClick={() => navigate(`/projects/${id}/board/tasks/create`)}
        >
          Create new task
        </SidebarItem>
        <SidebarItem leftIcon={<TruckIcon />}>Releases</SidebarItem>

        <SidebarItem leftIcon={<FilterIcon />}>Issues and filters</SidebarItem>
        <SidebarItem leftIcon={<PaperIcon />}>Pages</SidebarItem>
      </div>
    </div>
  );
};
