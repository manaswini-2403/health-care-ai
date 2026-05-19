import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function Charts({ records }) {
  const chartData = records.map((r, index) => ({
    name: `R${index + 1}`,
    weight: parseInt(r.weight),
    heartRate: parseInt(r.heartRate)
  }));

  return (
    <div className="card">
      <h3>📊 Health Trends</h3>

      {chartData.length === 0 ? (
        <p>No data for chart</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#ff4d6d" />
            <Line type="monotone" dataKey="heartRate" stroke="#6a5acd" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default Charts;