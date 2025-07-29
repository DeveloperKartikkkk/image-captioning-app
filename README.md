# AI Image Captioning Web App

A modern, responsive web application that generates AI-powered alt text and descriptions for uploaded images. Built with HTML, CSS, and JavaScript, featuring a beautiful UI and seamless user experience.

## 🌟 Features

- **Drag & Drop Upload**: Intuitive image upload with drag and drop support
- **Image Preview**: Real-time preview of uploaded images
- **AI-Powered Analysis**: Generate alt text, descriptions, and detailed image analysis
- **Copy to Clipboard**: One-click copying of generated content
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Visual feedback during AI processing

## 🚀 Quick Start

1. **Clone or download** the project files
2. **Open** `index.html` in your web browser
3. **Upload** an image by dragging and dropping or clicking to browse
4. **Click** "Generate Caption" to get AI-powered analysis
5. **Copy** the generated alt text and descriptions to your clipboard

## 📁 Project Structure

```
image-captioning-app/
├── index.html          # Main HTML file
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🎨 Features in Detail

### Image Upload
- Supports all common image formats (JPEG, PNG, GIF, WebP, etc.)
- File size validation (max 10MB)
- Drag and drop functionality
- Click to browse option
- Real-time image preview

### AI Analysis
- **Alt Text**: Concise, accessibility-focused descriptions
- **Detailed Description**: Comprehensive analysis of image content
- **Image Analysis**: Breakdown of colors, objects, mood, and composition

### User Experience
- Smooth animations and transitions
- Loading indicators
- Success/error notifications
- Copy to clipboard functionality
- Responsive design for all devices

## 🤖 AI Integration

The app currently uses simulated AI responses for demonstration. To integrate with real AI services, replace the `simulateAIAnalysis()` function in `script.js` with one of the following options:

### Option 1: OpenAI GPT-4 Vision API

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Replace the `simulateAIAnalysis()` function with:

```javascript
async function generateCaption() {
    if (!selectedImage) {
        showError('Please select an image first.');
        return;
    }
    
    showLoading();
    
    try {
        const results = await analyzeWithOpenAI(selectedImage);
        displayResults(results);
    } catch (error) {
        showError('Failed to generate caption. Please try again.');
        console.error('Error:', error);
    }
}

async function analyzeWithOpenAI(imageBase64) {
    const apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your API key
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4-vision-preview',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'Please analyze this image and provide: 1. A concise alt text for accessibility, 2. A detailed description of what you see, 3. Key visual elements like colors, objects, mood, and composition.'
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageBase64
                            }
                        }
                    ]
                }
            ],
            max_tokens: 500
        })
    });
    
    const data = await response.json();
    return parseOpenAIResponse(data);
}

function parseOpenAIResponse(data) {
    const content = data.choices[0].message.content;
    // Parse the response and extract alt text, description, and analysis
    // You'll need to implement parsing logic based on the AI response format
    
    return {
        altText: "Generated alt text",
        description: "Generated description",
        analysis: {
            colors: ["Color1", "Color2"],
            objects: ["Object1", "Object2"],
            mood: "Mood",
            composition: "Composition"
        }
    };
}
```

### Option 2: Google Cloud Vision API

1. Set up a Google Cloud project and enable Vision API
2. Get an API key from Google Cloud Console
3. Replace the `simulateAIAnalysis()` function with the Google Vision implementation

### Option 3: Azure Computer Vision

1. Create an Azure Computer Vision resource
2. Get your endpoint and API key
3. Implement the Azure Vision API integration

## 🔧 Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layout
- The app uses CSS custom properties for easy theming
- Responsive breakpoints are defined for mobile optimization

### Functionality
- Add new AI providers in `script.js`
- Modify the analysis output format
- Add additional file validation rules
- Implement image compression for better performance

### Features
- Add image editing capabilities
- Implement batch processing for multiple images
- Add export functionality (PDF, Word, etc.)
- Integrate with content management systems

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

## 🔒 Security Considerations

When integrating with AI APIs:
- Never expose API keys in client-side code
- Use a backend service to proxy API calls
- Implement rate limiting
- Add proper error handling
- Consider image privacy and data protection

## 🚀 Deployment

### Static Hosting
Deploy to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Firebase Hosting

### Backend Integration
For production use with AI APIs:
- Create a backend service (Node.js, Python, etc.)
- Proxy API calls through your server
- Implement proper authentication
- Add rate limiting and caching

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help with integration, please open an issue on the project repository.

---

**Note**: This is a frontend-only implementation. For production use with real AI APIs, you'll need to implement a backend service to handle API calls securely. 