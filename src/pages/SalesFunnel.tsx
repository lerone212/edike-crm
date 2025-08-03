import React from 'react';
import SalesFunnelVisual from '@/components/funnel/SalesFunnelVisual';

const SalesFunnel = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Sales Process Guide</h1>
        <p className="text-muted-foreground">
          Use this guide to understand the sales funnel stages and make informed decisions during school interactions
        </p>
      </div>
      
      <SalesFunnelVisual />
    </div>
  );
};

export default SalesFunnel;