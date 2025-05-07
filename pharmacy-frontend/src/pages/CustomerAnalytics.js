// CustomerAnalytics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/analytics?timeRange=${timeRange}`);
      setAnalyticsData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading analytics data...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!analyticsData) return null;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Customer Behavior Analytics</h2>
        <div className="time-filter">
          <label>Time Range:</label>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>
      
      <div className="analytics-cards">
        <div className="analytics-card">
          <h3>Visitors Overview</h3>
          <div className="analytics-number">{analyticsData.totalVisitors}</div>
          <p>Total visitors in selected period</p>
        </div>
        
        <div className="analytics-card">
          <h3>Conversion Rate</h3>
          <div className="analytics-number">{analyticsData.conversionRate}</div>
          <p>Visitors who made a purchase</p>
        </div>
        
        <div className="analytics-card">
          <h3>Average Order Value</h3>
          <div className="analytics-number">{analyticsData.averageOrderValue}</div>
          <p>Average spending per order</p>
        </div>
      </div>
      
      <div className="analytics-charts">
        <div className="analytics-chart">
          <h3>Top Selling Products</h3>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topSellingProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="analytics-chart">
          <h3>Customer Segments</h3>
          <div className="segment-bars">
            {analyticsData.customerSegments.map((segment, index) => (
              <div className="segment-bar-container" key={index}>
                <div className="segment-label">{segment.name}</div>
                <div className="segment-bar">
                  <div 
                    className="segment-fill" 
                    style={{ width: `${segment.percentage}%` }}
                  ></div>
                </div>
                <div className="segment-value">{segment.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="marketing-analysis">
        <h3>Marketing Campaign Effectiveness</h3>
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Channel</th>
              <th>Conversion Rate</th>
              <th>ROI</th>
            </tr>
          </thead>
          <tbody>
            {analyticsData.marketingEffectiveness.map((channel, index) => (
              <tr key={index}>
                <td>{channel.channel}</td>
                <td>{channel.conversion}</td>
                <td>{channel.roi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="analytics-actions">
        <h3>Recommended Actions</h3>
        <ul className="action-list">
          <li>Increase email marketing for returning customers (highest ROI)</li>
          <li>Create a promotion for {analyticsData.topSellingProducts[0]?.name || 'top products'} to boost sales</li>
          <li>Develop loyalty program to convert one-time buyers to returning customers</li>
        </ul>
      </div>
    </div>
  );
};

export default CustomerAnalytics;