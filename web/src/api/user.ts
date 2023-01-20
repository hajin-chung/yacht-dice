const ENDPOINT = import.meta.env.VITE_API_ENDPOINT as string;

const fetcher = (path: string, init?: RequestInit) =>
  fetch(`${ENDPOINT}${path}`, init);

const POST = async (path: string, body: any) => {
  const result = await fetcher(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const obj = await result.json();
  return obj;
};

const GET = async (path: string) => {
  const result = await fetcher(path, {
    method: "GET",
  });
  const obj = await result.json();
  return obj;
};

export const registerUser = async (name: string) => {
  const res = await POST("/register", { name });
  if (res.error === false) 
    return res.data.id as string;
  else throw Error("wrong user name");
};
