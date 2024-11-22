# AI Children's Story Generator

An interactive web application that generates personalized, age-appropriate stories for children using AI.

## Features

- Personalized story generation based on user input
- Age-appropriate content for different groups (3-5, 6-8, 9-12 years)
- Multiple story themes and settings
- Interactive story display
- Responsive, child-friendly design

## Tech Stack

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB
- AI: OpenAI GPT-3.5

## Setup

1. Clone the repository
```bash
git clone [your-repo-url]
cd ai-story-generator
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment Setup
Create a `.env` file in the backend directory with:
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/story-generator
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=30d
```

4. Start the application
```bash
# Start backend (from backend directory)
npm run start

# Start frontend (from frontend directory)
npm start
```

## Story Features

### Age Groups
- 3-5 years: Simple words, short sentences
- 6-8 years: Simple language, descriptive words
- 9-12 years: Engaging vocabulary, complex narratives

### Available Themes
- Adventure
- Friendship
- Learning
- Family
- Magic
- Nature
- Space
- Animals

### Settings
- Forest
- Space
- Ocean
- Castle
- City
- Mountain
- Jungle
- Desert
- Arctic
- School

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
