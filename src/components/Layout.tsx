
import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Brain, Zap, User, Award, BarChart3 } from 'lucide-react';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'Life Hunter System' }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-hunter-accent/20 bg-hunter-primary/90 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="hunter-badge h-8 w-8 animate-pulse-glow">
              <Award className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              <Link to="/">Life Hunter System</Link>
            </h1>
          </div>
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6">
              <li>
                <Link to="/quests" className="flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white">
                  <Zap className="h-4 w-4" />
                  <span>Quests</span>
                </Link>
              </li>
              <li>
                <Link to="/training" className="flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white">
                  <Dumbbell className="h-4 w-4" />
                  <span>Training</span>
                </Link>
              </li>
              <li>
                <Link to="/stats" className="flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white">
                  <BarChart3 className="h-4 w-4" />
                  <span>Stats</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex md:hidden">
            <button className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container px-4">
          {title && (
            <h2 className="mb-6 text-2xl font-bold tracking-tight">{title}</h2>
          )}
          {children}
        </div>
      </main>
      <footer className="border-t border-hunter-accent/20 bg-hunter-primary py-6">
        <div className="container px-4 text-center text-sm text-white/60">
          <p>Life Hunter System © {new Date().getFullYear()}</p>
        </div>
      </footer>
      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-hunter-accent/20 bg-hunter-primary/90 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around">
          <Link to="/" className="flex flex-1 flex-col items-center justify-center py-3">
            <Award className="h-5 w-5 text-white/80" />
            <span className="text-xs text-white/80">Home</span>
          </Link>
          <Link to="/quests" className="flex flex-1 flex-col items-center justify-center py-3">
            <Zap className="h-5 w-5 text-white/80" />
            <span className="text-xs text-white/80">Quests</span>
          </Link>
          <Link to="/training" className="flex flex-1 flex-col items-center justify-center py-3">
            <Dumbbell className="h-5 w-5 text-white/80" />
            <span className="text-xs text-white/80">Training</span>
          </Link>
          <Link to="/stats" className="flex flex-1 flex-col items-center justify-center py-3">
            <BarChart3 className="h-5 w-5 text-white/80" />
            <span className="text-xs text-white/80">Stats</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
