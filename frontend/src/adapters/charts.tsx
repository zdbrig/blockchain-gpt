import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, ChartOptions } from 'chart.js';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    backgroundColor: string;
    borderColor: string;
  }[];
}

const Charts = () => {
  const [coinName, setCoinName] = useState('');
  const [choice, setChoice] = useState('all');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const [chartId, setChartId] = useState('');
 
  useEffect(() => {
    if (chartData) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new Chart('myChart', {
        type: 'line',
        data: chartData,
        options: {},
      });
      setChartId('myChart');
    }
  }, [chartData]);
  
  useEffect(() => {
    if (chartRef.current && chartId !== 'myChart') {
      chartRef.current.destroy();
    }
  }, [chartId]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinName}/market_chart?vs_currency=usd&days=14&interval=daily`
      );

      let labels = response.data.prices.map(
        (price: any) => new Date(price[0]).toLocaleDateString()
      );

      let data: number[] = [];

      switch (choice) {
        case 'prices':
          data = response.data.prices.map((price: any) => price[1]);
          break;
        case 'market_caps':
          data = response.data.market_caps.map((market_cap: any) => market_cap[1]);
          break;
        case 'total_volumes':
          data = response.data.total_volumes.map((total_volume: any) => total_volume[1]);
          break;
        default:
          data = response.data.prices.map((price: any) => price[1]);
          break;
      }

      setChartData({
        labels: labels,
        datasets: [
          {
            label: `${choice} for ${coinName}`,
            data: data,
            fill: false,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Coin name:
          <input
            type="text"
            value={coinName}
            onChange={(event) => setCoinName(event.target.value)}
          />
        </label>
        <label>
          Data type:
          <select value={choice} onChange={(event) => setChoice(event.target.value)}>
            <option value="all">All</option>
            <option value="prices">Prices</option>
            <option value="market_caps">Market Caps</option>
            <option value="total_volumes">Total Volumes</option>
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
      <div>
        {chartData && <Line id="myChart" data={chartData} />}
      </div>
    </div>
  );
};

export default Charts;
