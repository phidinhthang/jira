import ReactModal from 'react-modal';
import { Avatar } from '../../common/components/Avatar';

export const FilterUserModal = ({
  isOpen,
  setOpen,
  users,
  onUserClick,
  highlightUser,
}) => {
  return (
    <ReactModal
      className='w-full my-10 mx-auto max-w-[480px] focus:outline-0 focus:border-0'
      overlayClassName='fixed top-0 left-0 right-0 bg-gray-700/70 overflow-y-auto h-full'
      isOpen={isOpen}
      onRequestClose={() => setOpen(false)}
    >
      <div className='px-4 py-6 bg-white'>
        <div className='w-full'>
          <h4 className='font-medium text-xl mb-4'>User Filter</h4>
          <div className='flex flex-col gap-2'>
            {users.map((user, index) => (
              <div key={user}>
                <Avatar size='lg' />
                <p>{user.displayName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ReactModal>
  );
};
