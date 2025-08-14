import type { Query } from '../domain/Query';

const useRestClient = () => {
  const send = async (query: Query) => {
    try {
      return await fetch(`http://192.168.178.67:5005/webhooks/rest/webhook`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender: 'user', message: query.question }),
      });
    } catch (error) {
      console.log('Error when sending the question to Backend Server', error);
    }
  };
  return {
    send,
  };
};

export default useRestClient;
