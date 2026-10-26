const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'saral-portal' });
});

app.get('/api/modules', (_req, res) => {
  res.json([
    { id: 'profile', name: 'Profile' },
    { id: 'documents', name: 'Documents' },
    { id: 'labs', name: 'Labs' },
    { id: 'funding', name: 'Funding' },
    { id: 'mentors', name: 'Mentors' },
    { id: 'review', name: 'Review' },
    { id: 'applications', name: 'Applications' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'settings', name: 'Settings' }
  ]);
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'saralayush.html'));
});

app.listen(port, () => {
  console.log(`SARAL portal running at http://localhost:${port}`);
});
