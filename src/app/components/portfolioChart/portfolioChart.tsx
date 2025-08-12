"use client";
import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export default function PortfolioChart({ chartData, stockQuantities }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
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
            // Individual stock contributions
            ...tickers.map((ticker, index) => {
              const colors = [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)', 
                'rgb(255, 205, 86)',
                'rgb(153, 102, 255)'
              ];
              
              const stockValues = chartData[ticker].map(price => 
                price * (stockQuantities[ticker] || 0)
              );
              
              return {
                label: `${ticker} Value`,
                data: stockValues,
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + '20',
                tension: 0.1,
              };
            })
          ],
        },
        options: {
          responsive: true,
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
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          },
        },
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, stockQuantities]);

  return (
    <div style={{ width: '100%', height: '400px', marginBottom: '20px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}