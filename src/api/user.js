import http from "./config";

// 用户相关API
export async function getUsers() {
  const res = await http.get("/users")
  return res.data;
}

// 学员相关API
export async function getStudents(params) {
  const res = await http.get("/students", { params })
  return res.data;
}

export async function getStudentById(id) {
  const res = await http.get(`/students/${id}`)
  return res.data;
}

export async function createStudent(student) {
  const res = await http.post("/students", student)
  return res.data;
}

export async function updateStudent(id, student) {
  const res = await http.put(`/students/${id}`, student)
  return res.data;
}

export async function deleteStudent(id) {
  const res = await http.delete(`/students/${id}`)
  return res.data;
}