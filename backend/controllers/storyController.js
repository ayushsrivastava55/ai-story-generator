const { HfInference } = require('@huggingface/inference');

const generateStory = async (req, res) => {
    try {
        const { characters, setting, theme, ageGroup } = req.body;
        
        // Initialize Hugging Face client
        const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

        // Format character introductions
        const mainCharacter = characters[0];
        const supportingCharacters = characters.slice(1).join(' and ');

        // Determine age-appropriate complexity
        let style = '';
        if (ageGroup.includes('3-5')) {
            style = 'simple words, short sentences, repetitive patterns';
        } else if (ageGroup.includes('6-8')) {
            style = 'simple language, descriptive words, short paragraphs';
        } else {
            style = 'engaging vocabulary, descriptive language, complex narrative';
        }

        // Create a shorter, more focused prompt
        const prompt = `Write a children's story (${ageGroup} years) about ${mainCharacter}${supportingCharacters ? ` and ${supportingCharacters}` : ''} in ${setting}. Theme: ${theme}. Style: ${style}. Start with "Once upon a time" and end with a moral lesson about ${theme}.

Story structure:
1. Introduce characters
2. Present a challenge
3. Show growth
4. Happy ending
5. End with "The End"`;

        // Generate the story using Hugging Face
        const result = await hf.textGeneration({
            model: 'gpt2-xl',
            inputs: prompt,
            parameters: {
                max_new_tokens: 750,
                temperature: 0.7,
                top_p: 0.95,
                repetition_penalty: 1.2,
                do_sample: true
            }
        });

        let story = result.generated_text;

        // Clean up the generated text
        story = story.replace(prompt, '').trim();

        // Ensure proper story formatting
        if (!story.toLowerCase().startsWith('once upon a time')) {
            story = 'Once upon a time, ' + story;
        }

        // Format paragraphs and ensure proper ending
        story = story
            .split('\n')
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph.length > 0)
            .join('\n\n');

        if (!story.toLowerCase().includes('the end')) {
            story += '\n\nThe End';
        }

        // Send the response
        res.status(200).json({
            success: true,
            story,
            metadata: {
                mainCharacter,
                setting,
                theme,
                ageGroup,
                supportingCharacters: characters.slice(1)
            }
        });

    } catch (error) {
        console.error('Story generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate story',
            message: error.message
        });
    }
};

module.exports = {
    generateStory
};
