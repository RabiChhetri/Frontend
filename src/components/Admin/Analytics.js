import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import '../../CSS/Analytics.css';
// Import icons from react-icons
import { FaCalendarAlt, FaRupeeSign, FaUsers } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { useCountUp } from '../../hooks/useCountUp';
import { motion } from 'framer-motion';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const chartContainerVariants = {
  hidden: { 
    opacity: 0,
    y: 30
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.3
    }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function Analytics() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [lastMonthActive, setLastMonthActive] = useState(0);
  const [activeUsersPercentageChange, setActiveUsersPercentageChange] = useState(0);
  const [revenueStats, setRevenueStats] = useState({
    total: 0,
    currentMonth: 0,
    lastMonth: 0,
    percentageChange: 0,
    trend: 'no change',
    loading: true
  });
  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    currentMonth: 0,
    lastMonth: 0,
    percentageChange: 0,
    trend: 'no change',
    loading: true
  });
  const [serviceStats, setServiceStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  // Appointments animations
  const animatedAppointments = useCountUp(appointmentStats.currentMonth, 800, 0);
  const animatedTotalAppointments = useCountUp(appointmentStats.total, 800, 0);
  const animatedLastMonthAppointments = useCountUp(appointmentStats.lastMonth, 800, 0);

  // Revenue animations
  const animatedRevenue = useCountUp(revenueStats.currentMonth, 800, 0);
  const animatedTotalRevenue = useCountUp(revenueStats.total, 800, 0);
  const animatedLastMonthRevenue = useCountUp(revenueStats.lastMonth, 800, 0);

  // Users animations
  const animatedActiveUsers = useCountUp(activeUsers, 800, 0);
  const animatedTotalUsers = useCountUp(totalUsers, 800, 0);
  const animatedLastMonthUsers = useCountUp(lastMonthActive, 800, 0);

  const fetchAppointmentStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/totalappointment/stats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAppointmentStats({
        total: data.total || 0,
        currentMonth: data.currentMonth || 0,
        lastMonth: data.lastMonth || 0,
        percentageChange: data.percentageChange || 0,
        trend: data.trend || 'no change',
        loading: false
      });
    } catch (error) {
      console.error('Error fetching appointment stats:', error);
      setAppointmentStats(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/totaluser/active');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setActiveUsers(data.count || 0);
      setLastMonthActive(0);
      const percentageChange = data.count > 0 ? 100 : 0;
      setActiveUsersPercentageChange(percentageChange);
    } catch (error) {
      console.error('Error fetching active users:', error);
      setActiveUsers(0);
      setLastMonthActive(0);
      setActiveUsersPercentageChange(0);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/totaluser/count');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTotalUsers(data.count || 0);
    } catch (error) {
      console.error('Error fetching total users:', error);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/totalrevenue/stats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRevenueStats({
        total: data.total || 0,
        currentMonth: data.currentMonth || 0,
        lastMonth: data.lastMonth || 0,
        percentageChange: data.percentageChange || 0,
        trend: data.trend || 'no change',
        loading: false
      });
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      setRevenueStats(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchServiceStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/totalappointment/service-stats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setServiceStats(data);
    } catch (error) {
      console.error('Error fetching service stats:', error);
    }
  };

  const fetchMonthlyRevenue = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/totalrevenue/monthly');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMonthlyRevenue(data);
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchTotalUsers();
    fetchActiveUsers();
    fetchAppointmentStats();
    fetchRevenueStats();
    fetchServiceStats();
    fetchMonthlyRevenue();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchActiveUsers();
      fetchAppointmentStats();
      fetchRevenueStats();
      fetchServiceStats();
      fetchMonthlyRevenue();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const getChangeIcon = (change) => {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '−';
  };

  const getChangeClass = (change) => {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  // Prepare data for pie chart
  const pieChartData = {
    labels: serviceStats.map(stat => stat.serviceName),
    datasets: [
      {
        data: serviceStats.map(stat => stat.count),
        backgroundColor: [
          'rgba(244, 114, 182, 0.8)',
          'rgba(56, 189, 248, 0.8)',
          'rgba(250, 204, 21, 0.8)',
          'rgba(52, 211, 153, 0.8)'
        ],
        borderColor: [
          'rgba(244, 114, 182, 1)',
          'rgba(56, 189, 248, 1)',
          'rgba(250, 204, 21, 1)',
          'rgba(52, 211, 153, 1)'
        ],
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverBorderColor: '#fff',
        hoverBackgroundColor: [
          'rgba(244, 114, 182, 0.9)',
          'rgba(56, 189, 248, 0.9)',
          'rgba(250, 204, 21, 0.9)',
          'rgba(52, 211, 153, 0.9)'
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            size: 13,
            weight: '500',
            family: "'Inter', sans-serif"
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        titleFont: {
          size: 14,
          weight: '600',
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif"
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return ` ${label}: ${value} bookings (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800,
      easing: 'easeOutQuart'
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 20
      }
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        hoverOffset: 5
      }
    }
  };

  // Prepare data for line chart
  const lineChartData = {
    labels: monthlyRevenue.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: monthlyRevenue.map(item => item.revenue),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            size: 13,
            weight: '500',
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        titleFont: {
          size: 14,
          weight: '600',
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif"
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `Revenue: Rs.${formatNumber(context.raw)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value) {
            return 'Rs.' + formatNumber(value);
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <div className="admin-dashboard-root">
      <Sidebar />
      <motion.div 
        className="admin-main-content"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="admin-content">
          <motion.div 
            className="analytics-cards"
            variants={containerVariants}
          >
            <motion.div 
              className="analytics-card"
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3>
                <FaCalendarAlt />
                Total Appointments
              </h3>
              <motion.div 
                className="metric"
                variants={fadeInVariants}
              >
                {appointmentStats.loading ? (
                  'Loading...'
                ) : (
                  formatNumber(animatedAppointments)
                )}
              </motion.div>
              <div className="info">
                Out of <span className="total-count">{formatNumber(animatedTotalAppointments)}</span> total appointments
              </div>
              <div className={`change ${getChangeClass(appointmentStats.percentageChange)}`}>
                {getChangeIcon(appointmentStats.percentageChange)} {Math.abs(appointmentStats.percentageChange)}% from last month
                <div className="trend-info">
                  <span className="animated-value">{formatNumber(animatedLastMonthAppointments)}</span> → 
                  <span className="animated-value">{formatNumber(animatedAppointments)}</span> appointments
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="analytics-card"
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3>
                <FaRupeeSign />
                Revenue
              </h3>
              <motion.div 
                className="metric"
                variants={fadeInVariants}
              >
                {revenueStats.loading ? (
                  'Loading...'
                ) : (
                  <>Rs.{formatNumber(animatedRevenue)}</>
                )}
              </motion.div>
              <div className="info">
                Total Revenue: <span className="total-count">Rs.{formatNumber(animatedTotalRevenue)}</span>
              </div>
              <div className={`change ${getChangeClass(revenueStats.percentageChange)}`}>
                {getChangeIcon(revenueStats.percentageChange)} {Math.abs(revenueStats.percentageChange)}% from last month
                <div className="trend-info">
                  Rs.<span className="animated-value">{formatNumber(animatedLastMonthRevenue)}</span> → 
                  Rs.<span className="animated-value">{formatNumber(animatedRevenue)}</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="analytics-card"
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3>
                <FaUsers />
                Active Users
              </h3>
              <motion.div 
                className="metric"
                variants={fadeInVariants}
              >
                {loading ? (
                  'Loading...'
                ) : (
                  formatNumber(animatedActiveUsers)
                )}
              </motion.div>
              <div className="info">
                Out of <span className="total-count">{formatNumber(animatedTotalUsers)}</span> total users
              </div>
              <div className={`change ${getChangeClass(activeUsersPercentageChange)}`}>
                {getChangeIcon(activeUsersPercentageChange)} {Math.abs(activeUsersPercentageChange)}% from last month
                <div className="trend-info">
                  <span className="animated-value">{formatNumber(animatedLastMonthUsers)}</span> → 
                  <span className="animated-value">{formatNumber(animatedActiveUsers)}</span> users
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="charts-container"
            variants={containerVariants}
          >
            <motion.div 
              className="service-stats-container"
              variants={chartContainerVariants}
              whileHover={{ scale: 1.01 }}
            >
              <h2>Service Booking Distribution</h2>
              <div className="pie-chart-container">
                <Pie data={pieChartData} options={pieOptions} />
              </div>
            </motion.div>

            <motion.div 
              className="revenue-trend-container"
              variants={chartContainerVariants}
              whileHover={{ scale: 1.01 }}
            >
              <h2>Monthly Revenue Trend</h2>
              <div className="line-chart-container">
                <Line data={lineChartData} options={lineOptions} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
