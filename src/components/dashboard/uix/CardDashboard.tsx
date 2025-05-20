import React, { ReactNode, CSSProperties } from 'react';
import { DollarSign, ShoppingBag, Users,   AlertTriangle, } from 'lucide-react';

// Component type definitions
interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

interface ProgressProps {
  value: number;
  className?: string;
}

// Define the type for a stat item
interface StatData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  progressValue: number;
  icon: ReactNode;
}

// Shadcn UI component equivalents
const Card: React.FC<CardProps> = ({ children, className, style }) => (
  <div className={`rounded-lg ${className}`} style={style}>
    {children}
  </div>
);

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
  <h3 className={`text-base font-semibold ${className}`}>{children}</h3>
);

const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={`p-4 pt-0 ${className}`}>{children}</div>
);

const Progress: React.FC<ProgressProps> = ({ value, className }) => (
  <div className={`relative w-full overflow-hidden rounded-full ${className}`}>
    <div className="h-full w-full bg-gray-700"></div>
    <div
      className="absolute top-0 left-0 h-full bg-yellow-500"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

// Sample data for stats
const statsData: StatData[] = [
  {
    title: 'Ventas del Día',
    value: 'S/. 2,450',
    change: '12% desde ayer',
    isPositive: true,
    progressValue: 75,
    icon: <DollarSign className="h-5 w-5 text-yellow-500" />
  },
  {
    title: 'Órdenes Pendientes',
    value: '24',
    change: '5% desde ayer',
    isPositive: false,
    progressValue: 45,
    icon: <ShoppingBag className="h-5 w-5 text-blue-500" />
  },
  {
    title: 'Clientes Atendidos',
    value: '78',
    change: '18% desde ayer',
    isPositive: true,
    progressValue: 68,
    icon: <Users className="h-5 w-5 text-yellow-500" />
  },
  {
    title: 'Inventario Bajo',
    value: '6 items',
    change: '3 menos que ayer',
    isPositive: true,
    progressValue: 32,
    icon: <AlertTriangle className="h-5 w-5 text-blue-500" />
  }
];

// Helper function for animation delay
const getAnimationDelay = (index: number): string => {
  return `${index * 100}ms`;
};

// CSS for animations
const styles = `
  @keyframes fadeSlideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeSlideUp {
    animation: fadeSlideUp 0.5s ease-out forwards;
    opacity: 0;
  }
`;

export const ImprovedStatsSection: React.FC = () => {
  return (
    <>
      <style>{styles}</style>
      
      {/* Stats summary with animations */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card 
            key={index} 
            className="overflow-hidden bg-gray-900 border border-gray-800 shadow-md transition-all duration-300 hover:shadow-lg hover:border-yellow-600 animate-fadeSlideUp"
            style={{ animationDelay: getAnimationDelay(index) }}
          >
            <CardHeader className="pb-2 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                <div className="rounded-full bg-gray-800 p-2 shadow-sm">
                  {stat.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className={`mt-1 flex items-center text-sm ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {stat.isPositive ? '↑' : '↓'} {stat.change}
              </div>
              <div className="mt-3">
                <Progress value={stat.progressValue} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};