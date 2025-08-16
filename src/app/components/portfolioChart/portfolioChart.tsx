"use client";
import styles from './portfolioChart.module.css';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useState } from 'react';

interface PortfolioChartProps {
  chartData: { [ticker: string]: number[] };
  stockQuantities: { [ticker: string]: number };
}

export default function PortfolioChart({ chartData, stockQuantities }: PortfolioChartProps) {
  const [visibleLines, setVisibleLines] = useState<Set<string>>(new Set(['totalPortfolio', ...Object.keys(chartData || {})]));

  if (!chartData || Object.keys(chartData).length === 0) {
    return (
      <div className={styles.chart_container}>
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
      const saturation = 60 + (i % 3) * 15;
      const lightness = 50 + (i % 2) * 20;
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    
    return colors;
  };

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

  // Legend interaction functions
  const toggleLine = (lineKey: string) => {
    setVisibleLines(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lineKey)) {
        newSet.delete(lineKey);
      } else {
        newSet.add(lineKey);
      }
      return newSet;
    });
  };

  const showOnlyStock = (ticker: string) => {
    setVisibleLines(new Set([ticker]));
  };

  const showAll = () => {
    setVisibleLines(new Set(['totalPortfolio', ...tickers]));
  };

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const visiblePayload = payload.filter((entry: any) => visibleLines.has(entry.dataKey));
      
      return (
        <div className={styles.chart_tooltip}>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{label}</p>
          {visiblePayload.map((entry: any, index: number) => (
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
    <div>
      {/* Interactive Legend Buttons */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        padding: '15px 10px',
        marginBottom: '10px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <button 
          onClick={showAll}
          style={{
            padding: '6px 12px',
            border: '2px solid #666',
            borderRadius: '20px',
            background: '#f8f9fa',
            color: '#666',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e9ecef';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f8f9fa';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Show All
        </button>
        
        <button
          onClick={() => toggleLine('totalPortfolio')}
          style={{
            padding: '6px 12px',
            border: '2px solid #2563eb',
            borderRadius: '20px',
            background: visibleLines.has('totalPortfolio') ? 'rgba(37, 99, 235, 0.1)' : 'white',
            color: visibleLines.has('totalPortfolio') ? '#2563eb' : '#999',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: visibleLines.has('totalPortfolio') ? '600' : '500',
            opacity: visibleLines.has('totalPortfolio') ? 1 : 0.6,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Total Portfolio
        </button>
        
        {tickers.map((ticker, index) => (
          <button
            key={ticker}
            onClick={() => showOnlyStock(ticker)}
            style={{
              padding: '6px 12px',
              border: `2px solid ${colors[index]}`,
              borderRadius: '20px',
              background: visibleLines.has(ticker) ? `${colors[index]}20` : 'white',
              color: visibleLines.has(ticker) ? colors[index] : '#999',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: visibleLines.has(ticker) ? '600' : '500',
              opacity: visibleLines.has(ticker) ? 1 : 0.6,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {ticker}
          </button>
        ))}
      </div>

      {/* Chart Container -  */}
      <div className={styles.chart_container}>
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
            
            {/* Main portfolio line */}
            {visibleLines.has('totalPortfolio') && (
              <Line 
                type="monotone" 
                dataKey="totalPortfolio" 
                stroke="#2563eb"
                strokeWidth={3}
                name="Total Portfolio"
                dot={false}
                activeDot={{ r: 5, stroke: '#2563eb', strokeWidth: 2 }}
              />
            )}
            
            {/* Individual stock lines */}
            {tickers.map((ticker, index) => (
              visibleLines.has(ticker) && (
                <Line 
                  key={ticker}
                  type="monotone" 
                  dataKey={ticker} 
                  stroke={colors[index]}
                  strokeWidth={2}
                  name={ticker}
                  dot={false}
                  strokeDasharray="5 5"
                  activeDot={{ r: 3, stroke: colors[index], strokeWidth: 1 }}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

     
    </div>
  );
}