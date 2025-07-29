const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment variables!');
    console.error('Please set your OpenAI API key in the .env file');
    process.exit(1);
}
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Image analysis endpoint
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
    // Security: Hide API key from logs
    const sanitizedHeaders = { ...req.headers };
    if (sanitizedHeaders.authorization) {
        sanitizedHeaders.authorization = 'Bearer [HIDDEN]';
    }
    
    console.log('📸 Image analysis request received');
    console.log('Headers:', sanitizedHeaders);
    try {
        // Check if image was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Convert image to base64
        const imageBase64 = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;
        const dataURI = `data:${mimeType};base64,${imageBase64}`;

        // Prepare the request to OpenAI
        const openAIRequest = {
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Please analyze this image and provide the following information in JSON format:
                            
                            {
                                "altText": "A concise alt text for accessibility (max 125 characters)",
                                "description": "A detailed description of what you see in the image (2-3 sentences)",
                                "analysis": {
                                    "colors": ["color1", "color2", "color3"],
                                    "objects": ["object1", "object2", "object3"],
                                    "mood": "mood description",
                                    "composition": "composition description"
                                }
                            }
                            
                            Focus on being descriptive and accurate. For alt text, prioritize accessibility and clarity.`
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: dataURI
                            }
                        }
                    ]
                }
            ],
            max_tokens: 500,
            temperature: 0.3
        };

        // Make request to OpenAI
        const response = await axios.post(OPENAI_API_URL, openAIRequest, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
        });

        // Extract the response content
        const content = response.data.choices[0].message.content;
        
        // Try to parse JSON from the response
        let parsedResponse;
        try {
            // Extract JSON from the response (it might be wrapped in markdown)
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedResponse = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            // If JSON parsing fails, create a structured response from the text
            console.log('Failed to parse JSON, creating structured response from text:', content);
            parsedResponse = {
                altText: content.substring(0, 125) + (content.length > 125 ? '...' : ''),
                description: content,
                analysis: {
                    colors: ['Various'],
                    objects: ['Multiple objects'],
                    mood: 'Neutral',
                    composition: 'Standard'
                }
            };
        }

        // Validate the response structure
        if (!parsedResponse.altText || !parsedResponse.description) {
            throw new Error('Invalid response structure from OpenAI');
        }

        res.json({
            success: true,
            data: parsedResponse
        });

    } catch (error) {
        console.error('Error analyzing image:', error.message);
        
        if (error.response) {
            // OpenAI API error - don't expose sensitive data
            const errorMessage = error.response.data?.error?.message || 'AI service error';
            res.status(error.response.status).json({
                error: 'AI service error',
                details: errorMessage
            });
        } else if (error.code === 'ECONNABORTED') {
            // Timeout error
            res.status(408).json({
                error: 'Request timeout',
                details: 'The AI service took too long to respond'
            });
        } else {
            // Other errors - don't expose internal details
            res.status(500).json({
                error: 'Internal server error',
                details: 'Something went wrong processing your request'
            });
        }
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        details: 'Something went wrong on the server'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Image Captioning API is ready!');
});

module.exports = app; 