import React from 'react';
import { FileCode2, Sparkles, Github } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20">
            <FileCode2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              ContractForge 
            </h1>
            <p className="text-xs text-slate-400">Automated Legal Document Compiler</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-400 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">
          FastAPI + React</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/50"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
}