const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); 

//login api
app.post('/api/login', (req, res) => {
  const { username } = req.body;

  const filePath = path.join(__dirname, 'data', 'user.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const users = JSON.parse(raw);

  const user = users.find(u => u.user_name === username);

  if (user) {
    res.json({
      success: true,
      user_id: user.user_id,
      role: user.role,
      user_name: user.user_name,
    });
  } else {
    res.status(401).json({ success: false, message: 'User name ot exist' });
  }
});

app.listen(PORT, () => {
  console.log(`backend in progress：http://localhost:${PORT}`);
});



//count discussion number of a course
app.get('/api/topic-post-count-by-course/:courseId', (req, res) => {
    const courseId = parseInt(req.params.courseId);
  
    const topics = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'topics.json')));
    const entries = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'entries.json')));
  
    const filteredTopics = topics.filter(topic => topic.course_id === courseId);
    const topicPostCount = filteredTopics.map(topic => {
      const postCount = entries.filter(entry => entry.topic_id === topic.topic_id).length;
      return {
        topic_title: topic.topic_title,
        post_count: postCount,
      };
    });
  
    res.json(topicPostCount);
  });

//when the most posts in a day
  app.get('/api/post-activity-by-time', (req, res) => {
    const entries = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'entries.json')));
  
    const result = {
      morning: 0,    // 5am - 12pm
      afternoon: 0,  // 12pm - 6pm
      evening: 0,    // 6pm - 11pm
      night: 0       // 11pm - 5am
    };
  
    entries.forEach(entry => {
      const timeStr = entry.entry_created_at;
      const hour = new Date(timeStr).getHours();
  
      if (hour >= 5 && hour < 12) {
        result.morning++;
      } else if (hour >= 12 && hour < 18) {
        result.afternoon++;
      } else if (hour >= 18 && hour < 23) {
        result.evening++;
      } else {
        result.night++;
      }
    });
  
    const formatted = Object.entries(result).map(([label, count]) => ({
      time_period: label,
      post_count: count,
    }));
  
    res.json(formatted);
  });

  

//get courses
  app.get('/api/courses', (req, res) => {
    const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'courses.json')));
    res.json(courses);
  });


// API get student active level
app.get('/api/student-activity', (req, res) => {
    const entries = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'entries.json')));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'user.json')));
  
    const userMap = {};
    users.forEach(users => {
      userMap[users.user_id] = users.user_name;
    });
  
    const studentActivity = entries.reduce((acc, entry) => {
      const id = entry.entry_posted_by_user_id; 
      if (!acc[id]) {
        acc[id] = {
          user_id: id,
          user_name: userMap[id] || `User${id}`,
          post_count: 0
        };
      }
      acc[id].post_count++;
      return acc;
    }, {});
  
    const activityArray = Object.values(studentActivity).sort((a, b) => b.post_count - a.post_count);
  
    res.json(activityArray);
  });


  //number of students for each course
  app.get('/api/course-enrollment-count', (req, res) => {
    const enrollments = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'enrollment.json')));
    const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'courses.json')));
  
    const courseMap = {};
    courses.forEach(course => {
      courseMap[course.course_id] = course.course_name;
    });
  
    const countMap = {};
  
    enrollments.forEach(e => {
      if (e.enrollment_type === 'student' && e.enrollment_state === 'active') {
        const courseName = courseMap[e.course_id] || `Course ${e.course_id}`;
        if (!countMap[courseName]) countMap[courseName] = 0;
        countMap[courseName]++;
      }
    });
  
    const result = Object.entries(countMap).map(([course_name, count]) => ({
      course_name,
      student_count: count,
    }));
  
    res.json(result);
  });

  //number of entries per month
  app.get('/api/monthly-post-count', (req, res) => {
    const entries = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'entries.json')));
  
    // active post
    const activeEntries = entries.filter(e => e.entry_state === 'active');
  
    const monthlyCounts = {};
  
    activeEntries.forEach(entry => {
      const date = new Date(entry.entry_created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  
      if (!monthlyCounts[monthKey]) {
        monthlyCounts[monthKey] = 0;
      }
      monthlyCounts[monthKey]++;
    });
  
    const result = Object.entries(monthlyCounts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month)); // sort from morning to night
  
    res.json(result);
  });


  //number of topics per course
  app.get('/api/course-topic-count', (req, res) => {
    const topics = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'topics.json')));
    const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'courses.json')));
  
    // topics that is active status
    const activeTopics = topics.filter(t => t.topic_state === 'active');
  
    //topics number by courses
    const courseTopicMap = {};
    activeTopics.forEach(topic => {
      if (!courseTopicMap[topic.course_id]) {
        courseTopicMap[topic.course_id] = 0;
      }
      courseTopicMap[topic.course_id]++;
    });
  

    //map course_id to course name
    const courseMap = {};
    courses.forEach(course => {
      courseMap[course.course_id] = course.course_name;
    });
  
    const result = Object.entries(courseTopicMap).map(([course_id, count]) => ({
      course_name: courseMap[course_id] || `课程 ${course_id}`,
      topic_count: count
    }));
  
    res.json(result);
  });
  
  
  //inactive students
  app.get('/api/inactive-students', (req, res) => {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'user.json')));
    const enrollments = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'enrollment.json')));
    const entries = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'entries.json')));
  
    //get which has posted user_id table
    const activeUserIds = new Set(
      entries
        .filter(entry => entry.entry_state === 'active')
        .map(entry => entry.entry_posted_by_user_id)
    );
  
    // userMap，record deleted status
    const userMap = {};
    const deletedUserSet = new Set(); //record which are the deleted user
  
    users.forEach(user => {
      if (user.user_state === 'registered') {
        userMap[user.user_id] = user.user_name;
      } else if (user.user_state === 'deleted') {
        userMap[user.user_id] = `${user.user_name} (Deleted)`;
        deletedUserSet.add(user.user_id);
      }
    });
  
    // student selected course but not post any entries
    const inactiveStudents = [];
    enrollments.forEach(enrollment => {
      if (
        enrollment.enrollment_state === 'active' &&
        enrollment.enrollment_type === 'student' &&
        !activeUserIds.has(enrollment.user_id)
      ) {
        inactiveStudents.push({
          user_id: enrollment.user_id,
          user_name: userMap[enrollment.user_id] || `Student ${enrollment.user_id}`,
          course_id: enrollment.course_id,
          is_deleted: deletedUserSet.has(enrollment.user_id)  
        });
      }
    });
  
    res.json(inactiveStudents);
  });
  

  
//each tables
const dataDir = path.join(__dirname, 'data');

app.get('/api/courses', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, 'courses.json')));
  res.json(data);
});

app.get('/api/enrollment', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, 'enrollment.json')));
  res.json(data);
});

app.get('/api/entries', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, 'entries.json')));
  res.json(data);
});

app.get('/api/topics', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, 'topics.json')));
  res.json(data);
});

app.get('/api/user', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, 'user.json')));
  res.json(data);
});


  
  

  app.get('/test', (req, res) => {
    res.json({ msg: 'Server is working!' });
  });
  
  
  