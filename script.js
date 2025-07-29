// Global variables
let selectedImage = null;
let imageFile = null;
let isAIMode = true; // Track current mode

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const generateBtn = document.getElementById('generateBtn');
const aiModeToggle = document.getElementById('aiModeToggle');
const modeLabel = document.getElementById('modeLabel');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    
    // Set initial button color for AI mode
    if (isAIMode) {
        generateBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
        generateBtn.style.boxShadow = '0 10px 20px rgba(46, 204, 113, 0.3)';
        generateBtn.classList.add('ai-mode');
    }
});

// Setup event listeners
function setupEventListeners() {
    // File input change
    imageInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Click to upload - use a more robust approach
    uploadArea.addEventListener('click', () => {
        // Reset the file input first to ensure it can trigger change events
        imageInput.value = '';
        imageInput.click();
    });
    
    // AI mode toggle
    aiModeToggle.addEventListener('change', handleModeToggle);
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        processImageFile(file);
    } else {
        showError('Please select a valid image file.');
    }
    
    // Reset the input value to allow selecting the same file again
    event.target.value = '';
}

// Handle drag over
function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('dragover');
}

// Handle drag leave
function handleDragLeave(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
}

// Handle drop
function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            processImageFile(file);
        } else {
            showError('Please drop a valid image file.');
        }
    }
}

// Process image file
function processImageFile(file) {
    imageFile = file;
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showError('Image size should be less than 10MB.');
        return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = function(e) {
        selectedImage = e.target.result;
        previewImage.src = selectedImage;
        showPreview();
    };
    reader.readAsDataURL(file);
}

// Show preview section
function showPreview() {
    document.querySelector('.upload-section').style.display = 'none';
    previewSection.style.display = 'flex';
    resultsSection.style.display = 'none';
    
    // Show home button when not on home page
    document.getElementById('homeBtn').style.display = 'flex';
}

// Remove image
function removeImage() {
    selectedImage = null;
    imageFile = null;
    imageInput.value = '';
    previewSection.style.display = 'none';
    resultsSection.style.display = 'none';
    document.querySelector('.upload-section').style.display = 'flex';
    
    // Force a reset of the file input to ensure it's completely cleared
    imageInput.type = 'file';
    
    // Hide home button when back on home page
    document.getElementById('homeBtn').style.display = 'none';
}

// Go home function
function goHome() {
    // Reset everything to initial state
    selectedImage = null;
    imageFile = null;
    imageInput.value = '';
    
    // Show upload section, hide others
    document.querySelector('.upload-section').style.display = 'flex';
    previewSection.style.display = 'none';
    loadingSection.style.display = 'none';
    resultsSection.style.display = 'none';
    
    // Hide home button
    document.getElementById('homeBtn').style.display = 'none';
    
    // Show success message
    showSuccess('Welcome back to home!');
}

// Handle mode toggle
function handleModeToggle() {
    isAIMode = aiModeToggle.checked;
    modeLabel.textContent = isAIMode ? 'Real AI Mode' : 'Demo Mode';
    
    // Update button text and styling
    const buttonText = isAIMode ? 'Generate Caption' : 'Generate Demo Caption';
    generateBtn.innerHTML = `<i class="fas fa-magic"></i> ${buttonText}`;
    
    // Update button color based on mode
    if (isAIMode) {
        generateBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
        generateBtn.style.boxShadow = '0 10px 20px rgba(46, 204, 113, 0.3)';
        generateBtn.classList.remove('demo-mode');
        generateBtn.classList.add('ai-mode');
    } else {
        generateBtn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        generateBtn.style.boxShadow = '0 10px 20px rgba(231, 76, 60, 0.3)';
        generateBtn.classList.remove('ai-mode');
        generateBtn.classList.add('demo-mode');
    }
    
    // Show notification
    const mode = isAIMode ? 'Real AI' : 'Demo';
    showSuccess(`Switched to ${mode} mode!`);
}

// Generate caption
async function generateCaption() {
    if (!selectedImage || !imageFile) {
        showError('Please select an image first.');
        return;
    }
    
    showLoading();
    
    try {
        let results;
        
        if (isAIMode) {
            // Send image to backend for real AI analysis
            results = await analyzeImageWithAI(imageFile);
        } else {
            // Use hardcoded responses for demo mode
            results = await simulateAIAnalysis();
        }
        
        displayResults(results);
    } catch (error) {
        showError('Failed to generate caption. Please try again.');
        console.error('Error:', error);
    }
}

// Real AI analysis using OpenAI GPT-4 Vision
async function analyzeImageWithAI(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze image');
    }
    
    const result = await response.json();
    return result.data;
}

// Simulate AI analysis for demo mode
async function simulateAIAnalysis() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    // Generate realistic captions based on image analysis
    const altText = generateAltText();
    const description = generateDescription();
    const analysis = generateImageAnalysis();
    
    return {
        altText,
        description,
        analysis
    };
}

// Generate alt text
function generateAltText() {
    const altTexts = [
        "A beautiful landscape photograph showing mountains and a lake",
        "A close-up portrait of a person with a warm smile",
        "A modern cityscape with tall buildings and blue sky",
        "A colorful abstract artwork with vibrant patterns",
        "A delicious meal presentation with fresh ingredients",
        "A cute pet animal in a natural setting",
        "A professional product photograph with clean background",
        "A scenic nature view with trees and sunlight",
        "A group of people enjoying an outdoor activity",
        "An architectural masterpiece with intricate details"
    ];
    
    return altTexts[Math.floor(Math.random() * altTexts.length)];
}

// Generate description
function generateDescription() {
    const descriptions = [
        "This image captures a stunning natural landscape with rolling hills and a serene lake reflecting the sky. The composition creates a sense of tranquility and showcases the beauty of nature's palette with various shades of green and blue.",
        
        "A professional portrait that conveys warmth and approachability. The subject's expression and lighting create an engaging visual that draws the viewer's attention and establishes a personal connection.",
        
        "A modern urban scene that represents contemporary city life. The architectural elements and skyline demonstrate the dynamic nature of urban development while maintaining visual harmony through careful composition.",
        
        "An artistic composition that explores color theory and abstract forms. The vibrant hues and geometric patterns create visual interest and demonstrate creative expression through digital or traditional media.",
        
        "A culinary presentation that emphasizes freshness and quality. The arrangement of ingredients and styling showcases both aesthetic appeal and the care taken in food preparation and presentation.",
        
        "A heartwarming moment captured between a pet and their environment. The natural setting and the animal's expression convey a sense of joy and the special bond between humans and animals.",
        
        "A clean, professional product shot that highlights quality and design. The minimalist approach focuses attention on the product's features while maintaining visual appeal through strategic lighting and composition.",
        
        "A peaceful natural setting that invites contemplation and relaxation. The interplay of light and shadow creates depth while the organic forms provide a connection to the natural world.",
        
        "A dynamic group scene that captures the energy and camaraderie of shared experiences. The composition and expressions convey the joy and connection that comes from participating in activities together.",
        
        "An architectural detail that showcases both historical significance and artistic craftsmanship. The intricate patterns and materials demonstrate the skill and vision of the original designers and builders."
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Generate image analysis
function generateImageAnalysis() {
    const analyses = [
        {
            colors: ["Blue", "Green", "White"],
            objects: ["Mountains", "Lake", "Sky"],
            mood: "Peaceful",
            composition: "Rule of thirds, balanced"
        },
        {
            colors: ["Warm tones", "Natural light"],
            objects: ["Person", "Background"],
            mood: "Friendly",
            composition: "Close-up, centered"
        },
        {
            colors: ["Blue", "Gray", "White"],
            objects: ["Buildings", "Sky", "Urban elements"],
            mood: "Modern",
            composition: "Leading lines, perspective"
        },
        {
            colors: ["Vibrant", "Multi-colored"],
            objects: ["Abstract shapes", "Patterns"],
            mood: "Creative",
            composition: "Dynamic, asymmetrical"
        },
        {
            colors: ["Fresh greens", "Rich browns"],
            objects: ["Food", "Ingredients", "Utensils"],
            mood: "Appetizing",
            composition: "Overhead, centered"
        }
    ];
    
    return analyses[Math.floor(Math.random() * analyses.length)];
}

// Show loading state
function showLoading() {
    previewSection.style.display = 'none';
    loadingSection.style.display = 'block';
    resultsSection.style.display = 'none';
}

// Display results
function displayResults(results) {
    loadingSection.style.display = 'none';
    
    // Update content
    document.getElementById('altText').textContent = results.altText;
    document.getElementById('description').textContent = results.description;
    
    // Display image analysis
    const analysisDiv = document.getElementById('imageAnalysis');
    analysisDiv.innerHTML = `
        <div class="analysis-item">
            <i class="fas fa-palette"></i>
            <span><strong>Colors:</strong> ${results.analysis.colors.join(', ')}</span>
        </div>
        <div class="analysis-item">
            <i class="fas fa-object-group"></i>
            <span><strong>Objects:</strong> ${results.analysis.objects.join(', ')}</span>
        </div>
        <div class="analysis-item">
            <i class="fas fa-heart"></i>
            <span><strong>Mood:</strong> ${results.analysis.mood}</span>
        </div>
        <div class="analysis-item">
            <i class="fas fa-crop"></i>
            <span><strong>Composition:</strong> ${results.analysis.composition}</span>
        </div>
    `;
    
    resultsSection.style.display = 'grid';
    
    // Show home button when results are displayed
    document.getElementById('homeBtn').style.display = 'flex';
}

// Copy to clipboard
async function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    const button = event.target.closest('.copy-btn');
    
    try {
        await navigator.clipboard.writeText(text);
        
        // Visual feedback
        button.classList.add('copied');
        button.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
        
        showSuccess('Copied to clipboard!');
    } catch (err) {
        showError('Failed to copy to clipboard.');
    }
}

// Show error message
function showError(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    showNotification(notification);
}

// Show success message
function showSuccess(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    showNotification(notification);
}

// Show notification
function showNotification(notification) {
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    if (notification.classList.contains('error')) {
        notification.style.background = '#e74c3c';
    } else {
        notification.style.background = '#27ae60';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Integration with real AI APIs (example functions)
// Replace the simulateAIAnalysis function with one of these:

// Example: OpenAI GPT-4 Vision API
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

// Example: Google Cloud Vision API
async function analyzeWithGoogleVision(imageBase64) {
    const apiKey = 'YOUR_GOOGLE_API_KEY'; // Replace with your API key
    
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            requests: [
                {
                    image: {
                        content: imageBase64.split(',')[1] // Remove data:image/... prefix
                    },
                    features: [
                        { type: 'LABEL_DETECTION', maxResults: 10 },
                        { type: 'TEXT_DETECTION' },
                        { type: 'FACE_DETECTION' },
                        { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
                        { type: 'IMAGE_PROPERTIES' }
                    ]
                }
            ]
        })
    });
    
    const data = await response.json();
    return parseGoogleVisionResponse(data);
}

// Helper function to convert image to base64
function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
} 