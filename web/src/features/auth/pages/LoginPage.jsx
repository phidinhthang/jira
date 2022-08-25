import { useState } from 'react';
import { Input } from '../../common/components/Input';
import { Button } from '../../common/components/Button';
import { useLoginMutation } from '../../../app/services/auth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  return (
    <>
      <div className='w-full py-4 h-screen max-w-[480px] mx-auto flex items-center justify-center'>
        <form
          className='w-full'
          onSubmit={(e) => {
            let hasError = false;
            e.preventDefault();
            if (!username) {
              setUsernameError('This field is required.');
              hasError = true;
            } else if (username.length < 3) {
              setUsernameError(
                'Username length must be greater than or equal to 3.'
              );
              hasError = true;
            } else if (username.length > 256) {
              setUsername(
                'Username length must be smaller than or equal to 256.'
              );
              hasError = true;
            }
            if (!password) {
              setPasswordError('This field is required.');
              hasError = true;
            }
            if (hasError) return;
            login({ username, password })
              .unwrap()
              .then((res) => {
                if (typeof res.accessToken === 'string') {
                  localStorage.setItem('bearerToken', res.accessToken);
                  navigate('/projects');
                  toast('Login successfully!', { type: 'success' });
                }
              })
              .catch((err) => {
                if (err?.data?.errors?.userDoesntExist) {
                  setUsernameError('Username does not exists.');
                }
                if (err?.data?.errors?.passwordIncorrect) {
                  setPasswordError('Password incorrect.');
                }
                console.log('error ', err);
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
              hasError={!!usernameError}
              onChange={(e) => {
                setUsernameError('');
                setUsername(e.target.value);
              }}
            />
            {!!usernameError ? (
              <span className='text-sm font-medium text-[#5e6c84] text-red-600'>
                {usernameError}
              </span>
            ) : null}
          </div>
          <div className='mb-3'>
            <label className='font-medium text-sm text-[#5e6c84]'>
              Password
            </label>
            <Input
              placeholder='Enter your password'
              type='password'
              value={password}
              hasError={!!passwordError}
              onChange={(e) => {
                setPasswordError('');
                setPassword(e.target.value);
              }}
            />
            {!!passwordError ? (
              <span className='text-sm font-medium text-[#5e6c84] text-red-600'>
                {passwordError}
              </span>
            ) : null}
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
            <Button
              className='py-2 mb-2'
              type='submit'
              isFullWidth={true}
              isLoading={isLoading}
            >
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
