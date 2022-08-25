import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../common/components/Input';
import { Button } from '../../common/components/Button';
import { useRegisterMutation } from '../../../app/services/auth';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  return (
    <>
      <div className='w-full py-4 h-screen max-w-[480px] mx-auto flex items-center justify-center'>
        <form
          className='w-full'
          onSubmit={(e) => {
            e.preventDefault();
            let hasError = false;
            if (!username) {
              setUsernameError('This field is required.');
              hasError = true;
            } else if (username.length < 3) {
              setUsernameError(
                'Username length must be greater than or equal to 3.'
              );
              hasError = true;
            } else if (username.length > 256) {
              setUsernameError(
                'Username length must be smaller than or equal to 256.'
              );
              hasError = true;
            }
            if (!password) {
              setPasswordError('This field is required.');
              hasError = true;
            }
            if (!email) {
              setEmailError('This field is required.');
              hasError = true;
            }
            if (!displayName) {
              setDisplayNameError('This field is required.');
              hasError = true;
            }
            if (hasError) return;
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
                if (err?.data?.errors?.usernameExists) {
                  setUsernameError('Username already exists.');
                }
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
              Display name
            </label>
            <Input
              placeholder='Enter your name'
              value={displayName}
              hasError={!!displayNameError}
              onChange={(e) => {
                setDisplayNameError('');
                setDisplayName(e.target.value);
              }}
            />
            {!!displayNameError ? (
              <span className='text-sm font-medium text-[#5e6c84] text-red-600'>
                {displayNameError}
              </span>
            ) : null}
          </div>
          <div className='mb-3'>
            <label className='font-medium text-sm text-[#5e6c84]'>Email</label>
            <Input
              placeholder='Enter your email'
              value={email}
              hasError={!!emailError}
              onChange={(e) => {
                setEmailError('');
                setEmail(e.target.value);
              }}
            />
            {!!emailError ? (
              <span className='text-sm font-medium text-[#5e6c84] text-red-600'>
                {emailError}
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
            Already have an account ?{' '}
            <Link
              to='/login'
              className='text-blue-700 hover:underline font-medium'
            >
              login
            </Link>
          </p>
          <div className='mt-3'>
            <Button
              className='py-2'
              type='submit'
              isFullWidth={true}
              isLoading={isLoading}
            >
              Register
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
