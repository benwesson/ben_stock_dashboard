"use client";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface PortfolioChartProps {
  chartData: { [ticker: string]: number[] };
  stockQuantities: { [ticker: string]: number };
}

export default function PortfolioChart({ chartData, stockQuantities }: PortfolioChartProps) {
  if (!chartData || Object.keys(chartData).length === 0) {
    return (
      <div className="chart-container">
        <p>No chart data available</p>
      </div>
    );
  }

  // Calculate combined portfolio value for each day
  const tickers = Object.keys(chartData);
  const maxLength = Math.max(...tickers.map(ticker => chartData[ticker].length));
  
  // Dynamic color generation based on number of tickers
  const generateColors = (count: number) => {
    const baseColors = ['#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#a4de6c', '#ffc0cb', '#87ceeb', '#dda0dd', '#f0e68c'];
    
    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    }
    
    // Generate additional colors using HSL
    const colors = [...baseColors];
    const remainingCount = count - baseColors.length;
    
    for (let i = 0; i < remainingCount; i++) {
      const hue = (i * 360 / remainingCount) % 360;
      const saturation = 60 + (i % 3) * 15; // Vary saturation between 60-90%
      const lightness = 50 + (i % 2) * 20;  // Vary lightness between 50-70%
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    
    return colors;
  };

  // Alternative: Use a color library approach
  const generateColorsAlternative = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137.508) % 360; // Golden angle approximation for good distribution
      const saturation = 70 + (i % 3) * 10; // 70%, 80%, 90%
      const lightness = 45 + (i % 2) * 15;  // 45%, 60%
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  };

  // Use the dynamic color generation
  const colors = generateColors(tickers.length);

  // Prepare data for Recharts
  const chartDataFormatted = [];
  
  for (let dayIndex = 0; dayIndex < maxLength; dayIndex++) {
    const date = new Date();
    date.setDate(date.getDate() - (maxLength - 1 - dayIndex));
    
    let totalPortfolioValue = 0;
    const dayData: any = {
      date: date.toLocaleDateString(),
      fullDate: date.toISOString().split('T')[0],
    };
    
    // Calculate individual stock values and total
    tickers.forEach(ticker => {
      const prices = chartData[ticker];
      const quantity = stockQuantities[ticker] || 0;
      
      if (prices && prices[dayIndex] !== undefined) {
        const stockValue = prices[dayIndex] * quantity;
        dayData[ticker] = stockValue;
        totalPortfolioValue += stockValue;
      } else {
        dayData[ticker] = 0;
      }
    });
    
    dayData.totalPortfolio = totalPortfolioValue;
    chartDataFormatted.push(dayData);
  }

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ margin: '2px 0', color: entry.color }}>
              {`${entry.dataKey === 'totalPortfolio' ? 'Total Portfolio' : entry.dataKey}: $${entry.value.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartDataFormatted}
          margin={{ top: 10, right: 15, left: 5, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            fontSize={11}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#666"
            fontSize={11}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Main portfolio line - thick and prominent */}
          <Line 
            type="monotone" 
            dataKey="totalPortfolio" 
            stroke="#2563eb"
            strokeWidth={3}
            name="Total Portfolio"
            dot={false}
            activeDot={{ r: 5, stroke: '#2563eb', strokeWidth: 2 }}
          />
          
          {/* Individual stock lines with dynamic colors */}
          {tickers.map((ticker, index) => (
            <Line 
              key={ticker}
              type="monotone" 
              dataKey={ticker} 
              stroke={colors[index]} // Use dynamic color
              strokeWidth={2}
              name={`${ticker}`}
              dot={false}
              strokeDasharray="5 5"
              activeDot={{ r: 3, stroke: colors[index], strokeWidth: 1 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      <style jsx>{`
        .chart-container {
          width: 100%;
          height: 250px;
        }
        
        .chart-tooltip {
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          font-size: 12px;
          max-width: 200px;
        }
        
        @media (min-width: 768px) {
          .chart-container {
            height: 350px;
          }
          .chart-tooltip {
            font-size: 14px;
            padding: 10px;
            max-width: 250px;
          }
        }
        
        @media (min-width: 1024px) {
          .chart-container {
            height: 400px;
          }
        }
      `}</style>
    </div>
  );
}