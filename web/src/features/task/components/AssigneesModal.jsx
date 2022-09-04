import ReactModal from 'react-modal';
import { Avatar } from '../../common/components/Avatar';

export const AssigneesModal = ({
  isOpen,
  setOpen,
  users,
  highlightUser,
  onUserSelected,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => setOpen(false)}
      className='w-full my-10 mx-auto max-w-[480px]'
      overlayClassName='fixed top-0 left-0 right-0 bg-gray-700/70 overflow-y-auto h-full'
    >
      <div className='p-10 pt-8 bg-white flex flex-col gap-3'>
        {users.map((user) => (
          <div
            className='flex items-center cursor-pointer'
            key={user.id}
            onClick={() => {
              onUserSelected(user);
            }}
          >
            <input
              type='checkbox'
              className='inline-block w-5 h-5 mr-4'
              checked={highlightUser(user)}
            ></input>
            <Avatar src={user.avatar} size='lg' />
            <p className='ml-4'>{user.displayName}</p>
          </div>
        ))}
      </div>
    </ReactModal>
  );
};
