
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InsightsSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aperçus IA et Recommandations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Modèles de Comportement Citoyen</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Les citoyens privilégient les services numériques pour leurs demandes</li>
              <li>• Les questions sur les actualités atteignent un pic pendant les heures ouvrables</li>
              <li>• Les demandes de service nécessitent plus de promotion et d'accessibilité</li>
              <li>• Les plaintes en ligne ont des taux de résolution plus élevés</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Recommandations</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Améliorer l'interface des services en ligne</li>
              <li>• Programmer plus de communications d'actualités</li>
              <li>• Simplifier l'accès aux services administratifs</li>
              <li>• Élargir la capacité de traitement des demandes</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsSection;
