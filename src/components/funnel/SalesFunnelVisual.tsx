import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SalesFunnelVisual = () => {
  const funnelStages = [
    {
      name: 'Awareness',
      color: 'bg-slate-400',
      description: 'The school becomes aware of Edike through outreach.',
      width: 'w-full'
    },
    {
      name: 'Interest',
      color: 'bg-blue-500',
      description: 'The school expresses curiosity—acknowledges, asks questions, or engages with materials.',
      width: 'w-[85%]'
    },
    {
      name: 'Intent',
      color: 'bg-orange-500',
      description: 'The school shows signals of intent, e.g., asks for a meeting or requests more information/proposal.',
      width: 'w-[70%]'
    },
    {
      name: 'Consideration',
      color: 'bg-green-500',
      description: 'The school evaluates Edike against their needs.',
      width: 'w-[55%]'
    },
    {
      name: 'Decision',
      color: 'bg-red-500',
      description: 'The school decides to either move forward with a partnership (yes) or declines (no).',
      width: 'w-[40%]'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Sales Funnel Overview</CardTitle>
        <p className="text-center text-muted-foreground">Guide for employee decision making in the sales process</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {funnelStages.map((stage, index) => (
            <div key={stage.name} className="flex flex-col items-center space-y-2">
              {/* Funnel Stage */}
              <div className={`${stage.width} relative`}>
                <div 
                  className={`${stage.color} text-white font-semibold text-lg py-6 px-8 text-center transform skew-y-1 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105`}
                  style={{
                    clipPath: index === 0 
                      ? 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' 
                      : index === funnelStages.length - 1
                      ? 'polygon(10% 0, 90% 0, 85% 100%, 15% 100%)'
                      : 'polygon(5% 0, 95% 0, 90% 100%, 10% 100%)'
                  }}
                >
                  {stage.name}
                </div>
              </div>
              
              {/* Description */}
              <div className="max-w-md text-center">
                <div 
                  className={`inline-block px-4 py-2 rounded-full border-2 text-sm font-medium`}
                  style={{ 
                    borderColor: stage.color.replace('bg-', '').replace('-500', ''),
                    color: stage.color.replace('bg-', '').includes('slate') ? '#64748b' : 
                           stage.color.replace('bg-', '').includes('blue') ? '#3b82f6' :
                           stage.color.replace('bg-', '').includes('orange') ? '#f97316' :
                           stage.color.replace('bg-', '').includes('green') ? '#22c55e' :
                           '#ef4444'
                  }}
                >
                  {stage.description}
                </div>
              </div>
              
              {/* Connector Arrow */}
              {index < funnelStages.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-muted-foreground"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Action Guide */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold text-center mb-2">Employee Action Guide</h3>
          <p className="text-sm text-muted-foreground text-center">
            Use this funnel to identify which stage each school is in and determine your next action steps. 
            Update the school's funnel stage after each interaction to track progress.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesFunnelVisual;