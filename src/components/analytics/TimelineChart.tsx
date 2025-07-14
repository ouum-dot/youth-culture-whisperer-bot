
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimelineData } from '@/types/analytics';

interface TimelineChartProps {
  data: TimelineData[];
  totalInteractions: number;
}

const TimelineChart: React.FC<TimelineChartProps> = ({ data, totalInteractions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chronologie des Interactions</CardTitle>
        <p className="text-sm text-gray-600">
          Toutes les interactions citoyennes enregistrées ({totalInteractions} total)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="interactions" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineChart;
