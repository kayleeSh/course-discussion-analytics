// Dahboard page used for test
// // pages/InstructorDashboard.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Grid,
//   Paper,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
//   Container,
//   Tabs,
//   Tab,
//   Skeleton,
// } from '@mui/material';
// import TopNavigation from './components/TopNavigation';

// import TopicPostCountChart from './components/TopicPostCountChart';
// import PostActivityChart from './components/PostActivityChart';
// import StudentActivityLeaderboard from './components/StudentActivityLeaderboard';
// import CourseEnrollmentChart from './components/CourseEnrollmentChart';
// import MonthlyPostTrendChart from './components/MonthlyPostTrendChart';
// import CourseTopicCountChart from './components/CourseTopicCountChart';
// import InactiveStudentsList from './components/InactiveStudentsList';


// function InstructorDashboard() {
//   const [courses, setCourses] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [tabIndex, setTabIndex] = useState(0);

//   useEffect(() => {
//     axios
//       .get('http://localhost:3001/api/courses')
//       .then((res) => {
//         setCourses(res.data);
//         if (res.data.length > 0) {
//           setSelectedCourseId(res.data[0].course_id);
//         }
//       })
//       .catch((err) => {
//         console.error('failed to get course：', err);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   const tabs = [
//     { label: 'Course Stats', icon: null },
//     { label: 'Student Activity', icon: null },
//     { label: 'Time-related Charts', icon: null },
//   ];

//   return (
//     <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>

//       <Container maxWidth="xl" sx={{ pt: 12, px: { xs: 2, md: 4 } }}>
//         {/* Tabs for Grouping Charts */}
//         <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} sx={{ mb: 4 }}>
//           <Tab label="📊 Course Statistics" />
//           <Tab label="📈 Student Activity Level" />
//           <Tab label="⏳ Time-Related Charts" />
//         </Tabs>

//         {/* Tab Content for Course Stats */}
//         {tabIndex === 0 && (
//           <Grid container spacing={3} sx={{ mb: 6 }}>
//             <Grid item xs={12} sm={6} md={4}>
//               <Paper elevation={3} sx={paperStyle}>
//                 <FormControl fullWidth sx={{ mb: 2 }}>
//                   <InputLabel id="course-select-label">select course</InputLabel>
//                   <Select
//                     labelId="course-select-label"
//                     value={selectedCourseId || ''}
//                     label="select course"
//                     onChange={(e) => setSelectedCourseId(parseInt(e.target.value))}
//                   >
//                     {courses.map((course) => (
//                       <MenuItem key={course.course_id} value={course.course_id}>
//                         {course.course_code} - {course.course_name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 <Box sx={{ minHeight: '200px' }}>
//                   {selectedCourseId ? (
//                     <TopicPostCountChart
//                       courseId={selectedCourseId}
//                       courseCode={courses.find((c) => c.course_id === selectedCourseId)?.course_code || ''}
//                       courseName={courses.find((c) => c.course_id === selectedCourseId)?.course_name || ''}
//                     />
//                   ) : (
//                     <Skeleton variant="rectangular" height={200} />
//                   )}
//                 </Box>
//               </Paper>
//             </Grid>

//             <Grid item xs={12} sm={6} md={4}>
//               <Box sx={{ minHeight: '300px' }}>
//                 {loading ? <Skeleton variant="rectangular" height={300} /> : <PostActivityChart />}
//               </Box>
//             </Grid>

//             <Grid item xs={12} sm={6} md={4}>
//               <Box sx={{ minHeight: '300px' }}>
//                 {loading ? <Skeleton variant="rectangular" height={300} /> : <MonthlyPostTrendChart />}
//               </Box>
//             </Grid>

//             <Grid item xs={12} sm={6} md={4}>
//               <Box sx={{ minHeight: '300px' }}>
//                 {loading ? <Skeleton variant="rectangular" height={300} /> : <CourseTopicCountChart />}
//               </Box>
//             </Grid>
//           </Grid>
//         )}

//         {/* Tab Content for Student Activity */}
//         {tabIndex === 1 && (
//           <Grid container spacing={3} sx={{ mb: 6 }}>
//             <Grid item xs={12} sm={6} md={3}>
//               <Box sx={{ minHeight: '300px' }}>
//                 {loading ? <Skeleton variant="rectangular" height={300} /> : <StudentActivityLeaderboard />}
//               </Box>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <Box sx={{ minHeight: '300px' }}>
//                 {loading ? <Skeleton variant="rectangular" height={300} /> : <InactiveStudentsList />}
//               </Box>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <Box sx={{ minHeight: '300px' }}>
//                 {loading ? <Skeleton variant="rectangular" height={300} /> : <CourseEnrollmentChart />}
//               </Box>
//             </Grid>
//           </Grid>
//         )}

//         {/* Tab Content for Time-Related Charts */}
//         {tabIndex === 2 && (
//           <Grid container spacing={3} sx={{ mb: 6 }}>
//             <Grid item xs={12} sm={6} md={6}>
//               <Box sx={{ minHeight: '300px' }}>
//                 {loading ? <Skeleton variant="rectangular" height={300} /> : <MonthlyPostTrendChart />}
//               </Box>
//             </Grid>

//             <Grid item xs={12} sm={6} md={6}>
//               <Box sx={{ minHeight: '300px' }}>
//                 {loading ? <Skeleton variant="rectangular" height={300} /> : <PostActivityChart />}
//               </Box>
//             </Grid>
//           </Grid>
//         )}
//       </Container>
//     </Box>
//   );
// }

// const paperStyle = {
//   p: 3,
//   height: '100%',
//   borderRadius: 3,
//   boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
//   backgroundColor: '#fff',
// };

// export default InstructorDashboard;
