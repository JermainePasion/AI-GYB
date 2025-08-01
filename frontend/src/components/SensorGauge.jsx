// SensorGauge.jsx
import React from 'react';

function getColor(sensor, value) {
  if (sensor === 'flex') {
    if (value <= 15) return '#10B981'; // Green
    if (value <= 35) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  }

  if (sensor === 'gyroY') {
    return Math.abs(value) <= 35 ? '#10B981' : '#EF4444';
  }

  if (sensor === 'gyroZ') {
    return Math.abs(value) <= 20 ? '#10B981' : '#EF4444';
  }

  return '#6B7280'; // Gray (fallback)
}

export default function SensorGauge({ title, angle, maxAngle, sensor }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.abs(angle) / maxAngle, 1);
  const offset = circumference * (1 - progress);
  const strokeColor = getColor(sensor, angle);

  const getStatus = () => {
    if (strokeColor === '#10B981') return 'Good';
    if (strokeColor === '#F59E0B') return 'Okay';
    if (strokeColor === '#EF4444') return 'Bad';
    return '';
  };

  function getStatusColor() {
    const status = getStatus();
    if (status === 'Good') return 'text-green-500';
    if (status === 'Okay') return 'text-yellow-500';
    if (status === 'Bad') return 'text-red-500';
    return 'text-gray-500';
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40 mb-0">
        <svg className="w-full h-full" viewBox="0 0 160 160">
          {/* Background Circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="12"
            fill="none"
          />

          {/* Progress Circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />

          {/* Centered Status Text */}
          <text
            x="80"
            y="85"
            textAnchor="middle"
            className={`text-sm font-semibold ${getStatusColor()}`}
            fontSize="14"
            fill={
              getStatusColor() === 'text-green-500'
                ? '#22c55e'
                : getStatusColor() === 'text-yellow-500'
                ? '#eab308'
                : '#ef4444'
            }
          >
            {getStatus()}
          </text>
           <text
                x="80"
                y="97"
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill={
              getStatusColor() === 'text-green-500'
                ? '#22c55e'
                : getStatusColor() === 'text-yellow-500'
                ? '#eab308'
                : '#ef4444'
            }
                >
                {(angle ?? 0).toFixed(1)}°
            </text>
        </svg>

        {/* Angle and Status Below (outside svg) */}

      </div>

      {/* Title */}
      <h2 className="text-base font-semibold text-center">{title}</h2>
    </div>
  );
}
