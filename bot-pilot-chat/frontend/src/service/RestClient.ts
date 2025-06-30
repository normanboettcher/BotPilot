import type { Query } from "../domain/Query";

const useRestClient = () => {
  const send = async (query: Query) => {
    try {
      return await fetch(`http://localhost:8000/chat?q=${query}`);
    } catch (error) {
      console.log("Error when sending the question to Backend Server", error);
    }
  };
  return {
    send,
  };
};

export default useRestClient;
