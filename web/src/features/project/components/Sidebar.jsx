import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { BoardIcon } from '../../../icons/BoardIcon';
import { CogIcon } from '../../../icons/CogIcon';
import { CollectionIcon } from '../../../icons/CollectionIcon';
import { FilterIcon } from '../../../icons/FilterIcon';
import { PaperIcon } from '../../../icons/PaperIcon';
import { PlusIcon } from '../../../icons/PlusIcon';
import { TruckIcon } from '../../../icons/TruckIcon';
import { LogoutIcon } from '../../../icons/LogoutIcon';
import { UserIcon } from '../../../icons/UserIcon';
import { Avatar } from '../../common/components/Avatar';
import { useGetMeQuery } from '../../../app/services/user';

const SidebarItem = ({
  isActive,
  onClick,
  leftIcon,
  children,
  className,
  isNotImplement,
}) => {
  const [text, setText] = useState(children);
  return (
    <div
      className={`flex items-center gap-3 p-2 pb-3 hover:bg-gray-200 text-[15px] font-medium cursor-pointer rounded-[6px] ${
        isActive ? 'bg-blue-100 text-blue-500' : 'bg-transparent'
      } ${isNotImplement ? 'cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      onMouseEnter={() => {
        if (isNotImplement) {
          setText(
            <span className='font-medium text-sm'>Not implement yet</span>
          );
        }
      }}
      onMouseLeave={() => {
        if (isNotImplement) {
          setText(children);
        }
      }}
    >
      {leftIcon}
      <span className='hidden sm:inline'>{text}</span>
    </div>
  );
};

export const Sidebar = () => {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.projectId;
  const { data: me } = useGetMeQuery();

  return (
    <div className='bg-gray-100 h-screen p-3 w-16 sm:w-[220px] flex-shrink-0'>
      <div className='flex flex-col gap-1'>
        <div className='p-2 pb-3 flex gap-3'>
          <Avatar src={me?.avatar} size='lg' />
          <h4 className='font-semibold hidden sm:block'>{me?.displayName}</h4>
        </div>
        <NavLink to={`/projects/${id}/profile`}>
          {({ isActive }) => (
            <SidebarItem
              isActive={isActive}
              leftIcon={<UserIcon width={24} height={24} />}
            >
              My Profile
            </SidebarItem>
          )}
        </NavLink>
        <NavLink to='/projects'>
          <SidebarItem leftIcon={<CollectionIcon width={24} height={24} />}>
            All Projects
          </SidebarItem>
        </NavLink>
        <NavLink to={`/projects/${id}/board`} end>
          {({ isActive }) => (
            <SidebarItem isActive={isActive} leftIcon={<BoardIcon />}>
              Kanban Board
            </SidebarItem>
          )}
        </NavLink>
        <NavLink to={`/projects/${id}/edit`} end>
          {({ isActive }) => (
            <SidebarItem leftIcon={<CogIcon />} isActive={isActive}>
              Project settings
            </SidebarItem>
          )}
        </NavLink>
        <NavLink to={`/projects/${id}/board/tasks/create`} end>
          {({ isActive }) => (
            <SidebarItem
              isActive={isActive}
              leftIcon={<PlusIcon width={24} height={24} />}
            >
              Create new task
            </SidebarItem>
          )}
        </NavLink>
        <SidebarItem leftIcon={<TruckIcon />} isNotImplement={true}>
          Releases
        </SidebarItem>

        <SidebarItem leftIcon={<FilterIcon />} isNotImplement={true}>
          Issues and filters
        </SidebarItem>
        <SidebarItem leftIcon={<PaperIcon />} isNotImplement={true}>
          Pages
        </SidebarItem>
        <SidebarItem
          onClick={() => {
            localStorage.removeItem('bearerToken');
            navigate('/login');
            toast('Logout successfully!', { type: 'success' });
          }}
          leftIcon={<LogoutIcon width={24} height={24} />}
        >
          Logout
        </SidebarItem>
      </div>
    </div>
  );
};
