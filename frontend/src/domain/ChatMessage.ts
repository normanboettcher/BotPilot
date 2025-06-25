
export type ChatMessage = {
    sender: 'user' | 'bot',
    message: string,
    timestamp: string
}