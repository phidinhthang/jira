import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const GoogleTokenPage = () => {
  const [searchParams] = useSearchParams();

  const bearerToken = searchParams.get('access_token');
  console.log('bearer token ', bearerToken);

  useEffect(() => {
    if (bearerToken) {
      localStorage.setItem('bearerToken', bearerToken);
      window.location.href = `${location.protocol}//${window.location.host}/projects`;
    }
  }, [bearerToken]);

  return <div>loading...</div>;
};
