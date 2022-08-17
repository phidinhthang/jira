import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useState } from 'react';
import { Input } from '../../common/components/Input';
import { Button } from '../../common/components/Button';

export const LoginPage = () => {
  const [value, setValue] = useState('thang');

  return (
    <>
      <div className='w-full py-4 h-screen max-w-[480px] mx-auto flex items-center justify-center'>
        <form className='w-full'>
          <div className='mb-3'>
            <label className='font-medium text-sm text-[#5e6c84]'>
              Username
            </label>
            <Input placeholder='Enter your username' />
          </div>
          <div className='mb-3'>
            <label className='font-medium text-sm text-[#5e6c84]'>
              Password
            </label>
            <Input placeholder='Enter your password' />
          </div>
          <div className='mt-6'>
            <Button className='py-2'>Login</Button>
          </div>
        </form>
      </div>
      <ReactQuill value={value} theme='snow' onChange={setValue} />
    </>
  );
};
