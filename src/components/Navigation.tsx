import { Link, useLocation } from 'react-router-dom';
import { PenTool, Music, User, Home } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/', emoji: '🏠' },
    { icon: PenTool, label: 'Journal', path: '/journal', emoji: '📝' },
    { icon: Music, label: 'Music', path: '/journal', emoji: '🎵' },
    { icon: User, label: 'Profile', path: '/onboard', emoji: '🧑‍💼' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border/50 z-50 md:relative md:bg-transparent md:border-0 md:backdrop-blur-none">
      <div className="flex justify-around items-center py-2 px-4 md:justify-start md:gap-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-3 rounded-xl transition-soul hover:scale-110 ${
                isActive 
                  ? 'gradient-soul text-primary-foreground shadow-glow' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute -top-1 -right-1 text-xs">{item.emoji}</span>
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;