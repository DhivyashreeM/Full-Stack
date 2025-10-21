import React from 'react';
import { Dna, Upload, BarChart3, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/processing', icon: BarChart3, label: 'Analysis' },
    { path: '/report', icon: Dna, label: 'Report' }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-teal-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Dna className="h-8 w-8 text-white" />
            <span className="text-white text-xl font-bold">BioDiversity Analyzer</span>
          </div>

          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
