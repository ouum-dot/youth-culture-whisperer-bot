
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChatData } from '@/types/analytics';

interface DebugInfoProps {
  chatData: ChatData[];
  timelineDataLength: number;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ chatData, timelineDataLength }) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <p className="text-sm text-blue-800">
          <strong>Debug:</strong> {chatData.length} interactions trouvées dans les données
          {chatData.length > 0 && (
            <span className="ml-2">
              (Dernière: {new Date(chatData[chatData.length - 1]?.timestamp).toLocaleString('fr-FR')})
            </span>
          )}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Timeline affiche {timelineDataLength} jours avec des interactions
        </p>
      </CardContent>
    </Card>
  );
};

export default DebugInfo;
