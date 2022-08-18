import { useNavigate } from 'react-router-dom';
import { ExclaimationIcon } from '../../../icons/ExclaimationIcon';
import { Button } from '../../common/components/Button';

export const VerifyErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className='bg-red-300 w-full h-screen flex items-center justify-center'>
      <div className='w-full px-4 max-w-[640px] flex items-center bg-white px-5 py-3 flex-col shadow-md'>
        <div>
          <ExclaimationIcon width={120} height={120} className='fill-red-500' />
        </div>
        <h1 className='mb-3 text-3xl font-semibold'>Email verified failure!</h1>
        <Button
          onClick={() => navigate('/projects')}
          className='px-4 py-3 my-2'
        >
          <span className='text-xl'>Go home</span>
        </Button>
      </div>
    </div>
  );
};
