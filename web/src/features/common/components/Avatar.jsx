const avatarSizeMap = {
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  sm: 'w-4 h-4',
};

export const Avatar = ({ size = 'md', className, src, ...props }) => {
  return (
    <div className={`rounded-full ${avatarSizeMap[size]}`} {...props}>
      <img className={`rounded-full object-cover ${className}`} src={src} />
    </div>
  );
};

export const AvatarList = ({
  limit = Infinity,
  onShowMore = () => {},
  users,
  liftUpOnHover,
  size = 'md',
  avatarClassname,
  isHighlight = () => {},
  onAvatarClick = () => {},
}) => {
  const displayUsers = users.slice(0, limit);
  const remainingUsers = limit < users.length ? users.length - limit : 0;

  return (
    <div className='flex items-center'>
      {displayUsers.map((user, index) => (
        <div
          className={`-ml-[5px] rounded-full border-2 flex items-center justify-center ${
            liftUpOnHover ? 'transition-transform hover:-translate-y-2' : ''
          } ${isHighlight(user) ? 'border-blue-700' : 'border-white'}`}
          onClick={() => onAvatarClick(user)}
        >
          <Avatar
            size={size}
            src={user.avatar}
            key={index}
            className={`${avatarClassname}`}
          />
        </div>
      ))}
      {remainingUsers ? (
        <div className='-ml-[5px]' onClick={onShowMore}>
          <div
            className={`${avatarSizeMap[size]} bg-gray-200 rounded-full flex items-center justify-center cursor-pointer select-none`}
          >
            <span className='text-sm font-medium text-gray-700'>
              +{remainingUsers}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
