"use client";
import { useEffect, useRef, useCallback } from 'react';
import { Chart } from 'chart.js/auto';

export default function PortfolioChart({ chartData, stockQuantities }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const containerRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  const createChart = useCallback(() => {
    if (chartRef.current && chartData && Object.keys(chartData).length > 0) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      // Calculate combined portfolio value for each day
      const tickers = Object.keys(chartData);
      const maxLength = Math.max(...tickers.map(ticker => chartData[ticker].length));
      
      const portfolioValues = [];
      const labels = [];

      // Generate labels (assuming data is daily)
      for (let i = 0; i < maxLength; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (maxLength - 1 - i)); // Go backwards from today
        labels.push(date.toLocaleDateString());
      }

      // Calculate total portfolio value for each day
      for (let dayIndex = 0; dayIndex < maxLength; dayIndex++) {
        let totalValue = 0;
        
        tickers.forEach(ticker => {
          const prices = chartData[ticker];
          const quantity = stockQuantities[ticker] || 0;
          
          if (prices && prices[dayIndex] !== undefined) {
            totalValue += prices[dayIndex] * quantity;
          }
        });
        
        portfolioValues.push(totalValue);
      }

      // Create the chart
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total Portfolio Value',
              data: portfolioValues,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.1,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Key: allows chart to fill container
          plugins: {
            title: {
              display: true,
              text: 'Portfolio Value Over Time',
            },
            legend: {
              position: 'top',
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.parsed.y.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  });
                }
              }
            },
          },
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Value ($)',
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Date',
              },
            },
          },
        },
      });
    }
  }, [chartData, stockQuantities]);

  useEffect(() => {
    createChart();

    const resizeObserver = new ResizeObserver(() => {
      // Clear existing timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Debounce the resize and force recreation
      resizeTimeoutRef.current = setTimeout(() => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
          createChart();
        }
      }, 300); // Wait 300ms after resize stops
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [createChart]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '400px',
        position: 'relative' 
      }}
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
}