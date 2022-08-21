import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../common/components/Input';
import { Button } from '../../common/components/Button';
import { useRegisterMutation } from '../../../app/services/auth';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  return (
    <>
      <div className='w-full py-4 h-screen max-w-[480px] mx-auto flex items-center justify-center'>
        <form
          className='w-full'
          onSubmit={(e) => {
            e.preventDefault();
            register({ username, password, displayName, email })
              .unwrap()
              .then((res) => {
                if (typeof res.accessToken === 'string') {
                  localStorage.setItem('bearerToken', res.accessToken);
                  navigate('/projects');
                }
              })
              .catch((err) => {
                console.log('register error ', err);
              });
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
              Display name
            </label>
            <Input
              placeholder='Enter your name'
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <label className='font-medium text-sm text-[#5e6c84]'>Email</label>
            <Input
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Already have an account ?{' '}
            <Link
              to='/login'
              className='text-blue-700 hover:underline font-medium'
            >
              login
            </Link>
          </p>
          <div className='mt-3'>
            <Button className='py-2' type='submit' isFullWidth={true}>
              Register
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
