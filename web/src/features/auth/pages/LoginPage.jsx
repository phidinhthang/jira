import { useState } from 'react';
import { Input } from '../../common/components/Input';
import { Button } from '../../common/components/Button';
import { useLoginMutation } from '../../../app/services/auth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();
  const navigate = useNavigate();

  return (
    <>
      <div className='w-full py-4 h-screen max-w-[480px] mx-auto flex items-center justify-center'>
        <form
          className='w-full'
          onSubmit={(e) => {
            e.preventDefault();
            login({ username, password })
              .unwrap()
              .then((res) => {
                if (typeof res.accessToken === 'string') {
                  localStorage.setItem('bearerToken', res.accessToken);
                  navigate('/projects');
                  toast('Login successfully!', { type: 'success' });
                }
              })
              .catch((err) => {});
          }}
        >
          <div className='mb-3'>
            <label className='font-medium text-sm text-[#5e6c84]'>
              Username
            </label>
            <Input
              placeholder='Enter your username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <label className='font-medium text-sm text-[#5e6c84]'>
              Password
            </label>
            <Input
              placeholder='Enter your password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className='text-sm'>
            Doesn't have an account ?{' '}
            <Link
              to='/register'
              className='text-blue-700 hover:underline font-medium'
            >
              register
            </Link>
          </p>
          <div className='mt-3'>
            <Button className='py-2 mb-2' type='submit' isFullWidth={true}>
              Login
            </Button>
            <Button
              className='py-2 flex items-center gap-3 bg-white!'
              isFullWidth
              onClick={(e) => {
                e.preventDefault();
                fetch(`${import.meta.env.VITE_API_URL}auth/google/url`)
                  .then((res) => res.json())
                  .then((data) => (window.location.href = data.url));
              }}
            >
              <img src='/google.png' className='w-6 h-6 rounded-full' />
              <span>Login with google</span>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
