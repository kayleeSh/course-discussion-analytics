const express = require('express');
const app = express();
const cors = require('cors');


app.use(cors());


app.get('/', (req, res) => {
  res.status(200).send('Welcome to the backend API!');
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Backend API is running smoothly!' });
  });
  
  
const discussions = require('./data');

app.get('/api/discussions', (req, res) => {
res.status(200).json(discussions);
});
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



const users = [
    { id: 1, role: 'admin' },
    { id: 2, role: 'instructor' },
  ];
  
  const authenticate = (req, res, next) => {
    const userId = parseInt(req.headers['user-id']);
    const user = users.find(u => u.id === userId);
  
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    req.user = user;
    next();
  };
  
  app.use(authenticate);
  