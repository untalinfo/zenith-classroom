
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, NotesIcon, BookmarksIcon, ProgressIcon } from './Icons';

const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: HomeIcon, label: 'Courses' },
    { to: '/notes', icon: NotesIcon, label: 'Notes' },
    { to: '/bookmarks', icon: BookmarksIcon, label: 'Saved' },
    { to: '/progress', icon: ProgressIcon, label: 'Progress' },
  ];

  const activeLinkClass = "text-purple-400";
  const inactiveLinkClass = "text-gray-400 hover:text-purple-300";

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700/50">
      <nav className="flex justify-around items-center h-full max-w-lg mx-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
