import { useState } from 'react';
import { useGetMeQuery } from '../../../app/services/user';
import { Avatar } from '../../common/components/Avatar';

export const ProfilePage = () => {
  const { data: me } = useGetMeQuery();
  const [displayName, setDisplayName] = useState();

  return (
    <div className='px-8 py-6'>
      <div>
        <div className='flex items-center gap-3'>
          <Avatar src={me?.avatar} size='xl' />
          <div>
            <h3 className='font-bold text-3xl'>{me.displayName}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
