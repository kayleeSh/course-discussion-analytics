import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

function TopicPostCountChart({ courseId, courseName, courseCode }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!courseId) return;
    axios
      .get(`http://localhost:3001/api/topic-post-count-by-course/${courseId}`)
      .then((res) => setData(res.data));
  }, [courseId]);

  return (
    <div>
      <h3>📊 View Post Count by Course: </h3>
      <h3>Topics of {courseCode} {courseName}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="topic_title" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="post_count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TopicPostCountChart;
