import { useState } from 'react';

interface AvatarProps {
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar = ({ src, size = 'md', className = '' }: AvatarProps) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };
  
  const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=soulsync&backgroundColor=ffd5dc,ffdfba,d1d4f9&clothesColor=ff6b9d,65c9ff,5199e4";
  
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden shadow-dreamy ring-4 ring-primary/20 float ${className}`}>
      <img
        src={!imageError && src ? src : defaultAvatar}
        alt="Avatar"
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default Avatar;