
import React from 'react';
import { Badge } from "@/components/ui/badge";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">MC</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Ministry of Communication & Culture
              </h2>
              <p className="text-sm text-gray-600">Youth Department</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Online
            </Badge>
            <Badge variant="outline">
              AI Assistant v2.0
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
