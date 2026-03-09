import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { text, targetLang } = await req.json();

        if (!text || !targetLang) {
            return NextResponse.json({ error: 'Text and targetLang are required' }, { status: 400 });
        }

        // If target language is English, no translation needed
        if (targetLang === 'en') {
            return NextResponse.json({ translatedText: text });
        }

        // Using MyMemory Translation API (Free, no API key required for low volume)
        // Rate limit: 500 words/day without email, 50000 words/day with email. We use it anonymously for simple UI strings.
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
        );

        if (!response.ok) {
            throw new Error('Translation failed');
        }

        const data = await response.json();

        // MyMemory returns translated text in responseData.translatedText
        if (data && data.responseData && data.responseData.translatedText) {
            // MyMemory sometimes includes the exact match disclaimer, we can clean it if needed, but usually it's clean for short phrases
            return NextResponse.json({ translatedText: data.responseData.translatedText });
        }

        throw new Error('Invalid response from translation API');
    } catch (error: any) {
        console.error('Translation API Error:', error);
        return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }
}
