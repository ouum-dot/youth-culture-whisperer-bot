
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '@/types/analytics';

interface CategoryChartProps {
  data: ChartData[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Catégories de Demandes Citoyennes</CardTitle>
        <p className="text-sm text-gray-600">
          Distribution des demandes citoyennes par catégorie : questions, plaintes, services et actualités
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
