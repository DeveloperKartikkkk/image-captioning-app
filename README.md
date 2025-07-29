# AI Image Captioning Web App

A modern, responsive web application that generates AI-powered alt text and descriptions for uploaded images. Built with Node.js, Express, and OpenAI GPT-4 Vision API, featuring a beautiful UI and seamless user experience.

## 🌟 Features

- **Drag & Drop Upload**: Intuitive image upload with drag and drop support
- **Image Preview**: Real-time preview of uploaded images
- **Real AI Analysis**: Powered by OpenAI GPT-4 Vision API
- **Smart Alt Text**: Accessibility-focused descriptions
- **Detailed Analysis**: Colors, objects, mood, and composition breakdown
- **Copy to Clipboard**: One-click copying of generated content
- **Home Navigation**: Easy navigation back to upload page
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Visual feedback during AI processing
- **Demo Mode**: Toggle between real AI and demo mode

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd image-captioning-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the application**
   ```bash
   # For development (with auto-restart)
   npm run dev
   
   # For production
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
image-captioning-app/
├── index.html          # Main HTML file
├── styles.css          # CSS styling and animations
├── script.js           # Frontend JavaScript functionality
├── server.js           # Express server with OpenAI integration
├── package.json        # Node.js dependencies and scripts
├── .env                # Environment variables (create this)
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🎨 Features in Detail

### Image Upload
- Supports all common image formats (JPEG, PNG, GIF, WebP, etc.)
- File size validation (max 10MB)
- Drag and drop functionality
- Click to browse option
- Real-time image preview
- Single upload fix (no more double-upload needed)

### AI Analysis (OpenAI GPT-4 Vision)
- **Alt Text**: Concise, accessibility-focused descriptions (max 125 characters)
- **Detailed Description**: Comprehensive analysis of image content (2-3 sentences)
- **Image Analysis**: Breakdown of colors, objects, mood, and composition
- **Real-time Processing**: Direct integration with OpenAI API

### User Experience
- Smooth animations and transitions
- Loading indicators with spinner
- Success/error notifications
- Copy to clipboard functionality
- Responsive design for all devices
- Home button for easy navigation
- Mode toggle (Real AI vs Demo)

## 🤖 AI Integration

The app uses **OpenAI GPT-4 Vision API** for real AI-powered image analysis:

### API Configuration
- **Model**: GPT-4 Vision (gpt-4o)
- **Max Tokens**: 500
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **File Size Limit**: 10MB per image

### Analysis Output
The AI provides structured JSON responses including:
- Alt text for accessibility
- Detailed image descriptions
- Color analysis
- Object detection
- Mood assessment
- Composition analysis

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000  # Optional, defaults to 3000
```

### API Key Setup
1. Sign up for OpenAI at [platform.openai.com](https://platform.openai.com/)
2. Create an API key in your dashboard
3. Add the key to your `.env` file

## 🚀 Deployment

### Local Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Production
```bash
npm start    # Uses node directly
```

### Cloud Deployment
The app can be deployed to:
- **Heroku**: Add `engines` to package.json
- **Railway**: Direct deployment from GitHub
- **Render**: Connect your repository
- **Vercel**: Node.js deployment
- **DigitalOcean App Platform**: Container deployment

### Environment Variables for Production
Make sure to set `OPENAI_API_KEY` in your production environment.

## 🔒 Security Features

- **API Key Protection**: Keys stored server-side only
- **Rate Limiting**: Prevents abuse with express-rate-limit
- **File Validation**: Size and type checking
- **CORS Configuration**: Secure cross-origin requests
- **Input Sanitization**: Proper handling of user inputs

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Experience

The app is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Optimized for portrait and landscape orientations
- Fast loading on mobile networks
- Native-like feel on mobile browsers

## 🛠️ Development

### Available Scripts
```bash
npm start    # Start production server
npm run dev  # Start development server with nodemon
npm run serve # Alternative start command
```

### Project Structure
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Backend**: Node.js with Express
- **AI Integration**: OpenAI GPT-4 Vision API
- **File Handling**: Multer for multipart/form-data

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you have any questions or need help with setup, please open an issue on the project repository.

## 🔄 Recent Updates

- ✅ Fixed double-upload issue
- ✅ Added home button navigation
- ✅ Integrated real OpenAI GPT-4 Vision API
- ✅ Added comprehensive error handling
- ✅ Improved UI/UX with better feedback
- ✅ Added demo mode toggle
- ✅ Enhanced mobile responsiveness

---

**Built with ❤️ using Node.js, Express, and OpenAI GPT-4 Vision API** 