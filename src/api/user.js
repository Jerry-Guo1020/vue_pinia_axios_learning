import http from "./config";



export async function getUsers() {
  const res = await http.get("/users")
  return res.data;
}