const useRestClient = () => {
    const send = async (question: string) => {
        try {
            return await fetch(`http://localhost:8000/chat?q=${encodeURIComponent(question)}`);
        } catch (error) {
            console.log('Error when sending the question to Backend Server',error);
        }
    }
    return {
        send
    }
}

export default useRestClient;