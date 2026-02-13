import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./TaskChart.css";

const COLORS = {
  todo: "#3498db",
  inprogress: "#f39c12",
  done: "#2ecc71",
};

function TaskChart({ tasks }) {
  const getTaskStats = () => {
    const stats = {
      todo: tasks.filter((t) => t.status === "todo").length,
      inprogress: tasks.filter((t) => t.status === "inprogress").length,
      done: tasks.filter((t) => t.status === "done").length,
    };

    const total = tasks.length;
    const completionPercentage = total > 0 ? (stats.done / total) * 100 : 0;

    // Format the percentage to remove unnecessary decimals
    const formattedPercentage =
      completionPercentage % 1 === 0
        ? Math.round(completionPercentage)
        : completionPercentage.toFixed(1);

    return { stats, total, completionPercentage: formattedPercentage };
  };

  const { stats, total, completionPercentage } = getTaskStats();

  const barData = [
    { name: "To Do", count: stats.todo, fill: COLORS.todo },
    { name: "In Progress", count: stats.inprogress, fill: COLORS.inprogress },
    { name: "Done", count: stats.done, fill: COLORS.done },
  ];

  const pieData = [
    { name: "To Do", value: stats.todo },
    { name: "In Progress", value: stats.inprogress },
    { name: "Done", value: stats.done },
  ].filter((item) => item.value > 0);

  return (
    <div className="task-chart-container">
      <h3 className="chart-title">📊 Task Progress Overview</h3>

      <div className="stats-summary">
        <div className="stat-card">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completion</span>
          <span className="stat-value">{completionPercentage}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Done</span>
          <span className="stat-value">{stats.done}</span>
        </div>
      </div>

      <div className="charts-wrapper">
        <div className="chart-section">
          <h4>Task Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8">
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {total > 0 && (
          <div className="chart-section">
            <h4>Status Breakdown</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[Object.keys(COLORS)[index]]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskChart;
