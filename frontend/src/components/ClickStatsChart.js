import React, { useEffect, useState } from 'react';
import { Box, Heading, Badge, Spinner, Center } from '@chakra-ui/react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const ClickStatsChart = ({ destinationId }) => {
  const [clickStats, setClickStats] = useState(null);
  const [dailyClicks, setDailyClicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClickStats() {
      try {
        // Συνολικά clicks 30 ημερών
        const clickRes = await axios.get(`http://localhost:5050/api/destinations/${destinationId}/clicks`);
        setClickStats(clickRes.data);

        // Clicks ανά μέρα (για το γράφημα)
        const dailyRes = await axios.get(`http://localhost:5050/api/destinations/${destinationId}/clicks/daily`);
        setDailyClicks(dailyRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch click stats:', err);
        setLoading(false);
      }
    }
    fetchClickStats();
  }, [destinationId]);

  if (loading) {
    return (
      <Center>
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <Box mt={6}>
      {/* Badge clicks */}
      {clickStats && (
        <Box p={4} bg="gray.50" borderRadius="md" border="1px solid #e2e8f0" mb={4}>
          <Heading size="md" mb={2}>📊 Click Stats (Last 30 Days)</Heading>
          <Badge colorScheme="purple" fontSize="lg" p={2}>
            {clickStats.clicks_last_30_days} clicks
          </Badge>
        </Box>
      )}

      {/* Line chart clicks ανά μέρα */}
      {dailyClicks.length > 0 && (
        <Box p={4} bg="white" borderRadius="md" border="1px solid #e2e8f0">
          <Heading size="sm" mb={4}>📈 Clicks Trend (Last 30 Days)</Heading>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyClicks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickFormatter={(day) =>
                  new Date(day).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) =>
                  `Date: ${new Date(label).toLocaleDateString('en-GB')}`
                }
              />
              <Line type="monotone" dataKey="clicks" stroke="#3182CE" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default ClickStatsChart;
