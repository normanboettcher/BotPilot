import type { Query } from "../domain/Query";

const useRestClient = () => {
  const send = async (query: Query) => {
    try {
      return await fetch(`http://localhost:8000/api/faqs`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      });
    } catch (error) {
      console.log("Error when sending the question to Backend Server", error);
    }
  };
  return {
    send,
  };
};

export default useRestClient;
