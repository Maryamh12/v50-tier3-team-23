const baseUrl = import.meta.env.VITE_APP_PUBLIC_SERVER_URL;

console.log("Server URL:", import.meta.env.VITE_APP_PUBLIC_SERVER_URL);
const url = `${import.meta.env.VITE_APP_PUBLIC_SERVER_URL}/getAllUsers`;
console.log("Full URL:", url);

export const getAllUsers = async () => {
  const url = `${baseUrl}/getAllUsers`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return console.log(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.log(error.message);
  }
};

export const createUser = async (email: string, name: string) => {
  const url = `${baseUrl}/createUser`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_email: email,
        name: name,
      }),
    });
    console.log("SUCCESS CREATING USER: ", response);
    return response;
  } catch (error) {
    console.log("ERROR CREATING USER");
    console.log(error);
  }
};
