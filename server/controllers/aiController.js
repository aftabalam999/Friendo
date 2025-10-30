import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate AI caption and hashtags for video
export const generateCaption = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title is required to generate caption',
      });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key not configured',
      });
    }

    // Create prompt for GPT
    const prompt = `Generate a catchy, engaging caption and 5 trending hashtags for a short video titled: "${title}". 
    
    The caption should be:
    - Fun and Gen-Z friendly
    - Under 100 characters
    - Engaging and attention-grabbing
    
    Hashtags should be:
    - Trending and relevant
    - Mix of general and specific tags
    
    Format the response as JSON:
    {
      "caption": "your caption here",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
    }`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a creative social media content creator specializing in short-form video content for platforms like TikTok and Instagram Reels.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    // Parse the response
    const responseText = completion.choices[0].message.content.trim();
    
    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      // If not valid JSON, create a structured response
      result = {
        caption: responseText.split('\n')[0] || 'Check this out! 🔥',
        hashtags: ['trending', 'viral', 'fyp', 'explore', 'foryou'],
      };
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Generate caption error:', error);
    
    // Provide fallback response
    res.status(200).json({
      success: true,
      data: {
        caption: '✨ Don\'t miss this! Drop a like if you agree! 🔥',
        hashtags: ['trending', 'viral', 'fyp', 'explore', 'foryou'],
      },
      message: 'Using fallback caption (AI service unavailable)',
    });
  }
};
