import http from "./config";

export const gerUsers = async() => {
    const response = await http.get("/user")
    return response.data;
}

export const login = async (username, password) => {
    const response = await http.post("/login", {
        username: username,
        password: password
    });
    return response.data
}