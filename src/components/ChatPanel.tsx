'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatPanel({ contextData }: { contextData: any }) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: 'Hello! I am AgroSense AI. How can I help you with your farm today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMsg }].map(m => ({
                        role: m.role,
                        content: m.content
                    })),
                    context: contextData
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();
            setMessages(prev => [...prev, data.message]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <Bot className="w-5 h-5 text-green-600" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">AgroSense Assistant</h3>
                    <p className="text-xs text-gray-500">Always here to help</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-green-600'}`}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${msg.role === 'user' ? 'bg-green-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-sm shadow-sm'}`}>
                            {msg.role === 'user' ? (
                                <p>{msg.content}</p>
                            ) : (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({ node, ...props }) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc ml-5 mb-3 space-y-1" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal ml-5 mb-3 space-y-1" {...props} />,
                                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                        h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 text-gray-900" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-3 text-gray-900 mt-4" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-2 text-gray-900 mt-3" {...props} />,
                                        a: ({ node, ...props }) => <a className="text-green-600 font-medium hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-green-500 pl-4 py-1 italic text-gray-600 bg-green-50/50 my-3 rounded-r" {...props} />,
                                        table: ({ node, ...props }) => <div className="overflow-x-auto mb-3 border border-gray-200 rounded-lg"><table className="w-full text-left border-collapse" {...props} /></div>,
                                        th: ({ node, ...props }) => <th className="bg-gray-50 p-2 border-b border-gray-200 font-bold" {...props} />,
                                        td: ({ node, ...props }) => <td className="p-2 border-b border-gray-100" {...props} />,
                                        code: ({ node, className, children, ...props }: any) => {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const isInline = !match && !String(children).includes('\n');
                                            return isInline ? (
                                                <code className="bg-gray-100/80 text-green-700 px-1.5 py-0.5 rounded-md text-xs font-mono border border-gray-200/50" {...props}>
                                                    {children}
                                                </code>
                                            ) : (
                                                <code className="block bg-[#1E1E1E] text-gray-100 p-4 rounded-xl text-xs overflow-x-auto mb-3 font-mono shadow-sm" {...props}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-green-600">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                            <span className="text-sm text-gray-500">AgroSense is typing...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about crops, pests, or farming..."
                    className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all text-gray-900"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors shadow-sm"
                >
                    <Send className="w-5 h-5 ml-1" />
                </button>
            </form>
        </div>
    );
}
