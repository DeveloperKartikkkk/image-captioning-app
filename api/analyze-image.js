const multer = require('multer');
const axios = require('axios');

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Helper function to handle multipart form data
function parseMultipartData(req) {
    return new Promise((resolve, reject) => {
        upload.single('image')(req, {}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(req.file);
            }
        });
    });
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Check if API key is available
        if (!OPENAI_API_KEY) {
            console.error('❌ OPENAI_API_KEY not found in environment variables!');
            return res.status(500).json({ error: 'OpenAI API key not configured' });
        }

        // Parse the multipart form data
        const file = await parseMultipartData(req);
        
        // Check if image was uploaded
        if (!file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        console.log('📸 Image analysis request received');

        // Convert image to base64
        const imageBase64 = file.buffer.toString('base64');
        const mimeType = file.mimetype;
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
            temperature: 0.7
        };

        // Make request to OpenAI
        const openAIResponse = await axios.post(OPENAI_API_URL, openAIRequest, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
        });

        // Parse OpenAI response
        const aiContent = openAIResponse.data.choices[0].message.content;
        
        // Try to parse JSON from the response
        let parsedResponse;
        try {
            // Extract JSON from the response (it might be wrapped in markdown)
            const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedResponse = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            console.error('Failed to parse OpenAI response:', parseError);
            // Fallback response
            parsedResponse = {
                altText: "Image analysis completed",
                description: aiContent,
                analysis: {
                    colors: ["Various"],
                    objects: ["Multiple objects detected"],
                    mood: "Analyzed",
                    composition: "Standard composition"
                }
            };
        }

        // Return the structured response
        res.status(200).json({
            success: true,
            data: parsedResponse
        });

    } catch (error) {
        console.error('Error processing image:', error);
        
        if (error.response) {
            // OpenAI API error
            const status = error.response.status;
            const message = error.response.data?.error?.message || 'OpenAI API error';
            
            if (status === 401) {
                return res.status(401).json({ error: 'Invalid API key' });
            } else if (status === 429) {
                return res.status(429).json({ error: 'Rate limit exceeded' });
            } else if (status === 400) {
                return res.status(400).json({ error: 'Invalid request to OpenAI' });
            } else {
                return res.status(500).json({ error: `OpenAI API error: ${message}` });
            }
        } else if (error.code === 'ECONNABORTED') {
            return res.status(408).json({ error: 'Request timeout' });
        } else {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}; 