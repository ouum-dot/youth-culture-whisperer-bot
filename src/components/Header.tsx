
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 shadow-2xl border-b border-blue-800/50 overflow-hidden">
      {/* Motif de fond décoratif */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Effet de brillance animé */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      
      <div className="container mx-auto px-6 py-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Logo ministériel avec couronne */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-yellow-300/50 relative overflow-hidden">
                {/* Effet de brillance sur le logo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent transform rotate-45 translate-x-full animate-[shine_3s_ease-in-out_infinite]"></div>
                <Crown className="text-white text-2xl drop-shadow-lg relative z-10" size={28} />
              </div>
              {/* Badge République */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-lg">
                M
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-white drop-shadow-lg">
                  Ministère de la Communication et Culture
                </h2>
                <Sparkles className="text-yellow-400 animate-pulse" size={20} />
              </div>
              <p className="text-blue-200 text-sm font-medium">
                Département de la Jeunesse • République du Ministère
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-xs font-medium">Service Public Digital</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Badges de statut améliorés */}
            <div className="flex flex-col space-y-2">
              <Badge className="bg-green-500/20 text-green-300 border-green-400/50 backdrop-blur-sm px-3 py-1 font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Système Opérationnel
              </Badge>
              <Badge variant="outline" className="text-blue-200 border-blue-400/50 backdrop-blur-sm px-3 py-1">
                Assistant IA Ministériel v2.0
              </Badge>
            </div>
            
            {/* Indicateur de performance */}
            <div className="hidden md:block text-right">
              <div className="text-xs text-blue-300 font-medium">Performances</div>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-green-300 text-xs ml-2">Excellent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
