import type { Query } from '../domain/Query';

export interface RestClient {
  send: (query: Query) => Promise<Response | undefined>;
  get: (url: string) => Promise<Response | undefined>;
}

const useRestClient = (): RestClient => {
  const send = async (query: Query) => {
    try {
      return await fetch(`http://192.168.178.65:5005/webhooks/rest/webhook`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender: 'user', message: query.question }),
      });
    } catch (error) {
      console.error('Error when sending the question to Backend Server', error);
    }
  };
  const get = async (url: string) => {
    try {
      return await fetch(url);
    } catch (error) {
      console.error(
        `Error when fetching the GET-request to Backend Server: [${url}]`,
        error
      );
    }
  };
  return {
    send,
    get,
  };
};

export default useRestClient;
