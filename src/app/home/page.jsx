"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
    const router = useRouter();
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({ name: "", phone: "" });
    const [editStudent, setEditStudent] = useState({ id: null, name: "", phone: "" });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get("/api/students");
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const handleAddStudent = async () => {
        if (!newStudent.name.trim() || !newStudent.phone.trim()) return;
        try {
            const response = await axios.post("/api/students", newStudent);
            setStudents([...students, response.data]);
            setNewStudent({ name: "", phone: "" });
        } catch (error) {
            console.error("Error adding student:", error);
        }
    };

    const handleUpdateStudent = async () => {
        if (!editStudent.name.trim() || !editStudent.phone.trim()) return;
        try {
            const response = await axios.put(`/api/students/${editStudent.id}`, editStudent);
            setStudents(students.map(student => student._id === editStudent.id ? { ...student, ...editStudent } : student));
            setEditStudent({ id: null, name: "", phone: "" });
        } catch (error) {
            console.error("Error updating student:", error);
        }
    };

    const handleDeleteStudent = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this student?");
        if (confirmDelete) {
            try {
                await axios.delete(`/api/students/${id}`);
                setStudents(students.filter(student => student._id !== id));
            } catch (error) {
                console.error("Error deleting student:", error);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await axios.get("/api/users/logout");
            router.push("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-4">
        {/* Logout Button - Positioned at the top-right */}
        <button
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={handleLogout}
        >
          Logout
        </button>
      
        {/* Student Management Section */}
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full sm:max-w-lg sm:w-auto mt-12">
          <h1 className="text-3xl mb-4 text-center">Manage Students</h1>
      
          {/* Add Student Form */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              className="border rounded p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Phone"
              value={newStudent.phone}
              onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
              className="border rounded p-2 w-full mb-4"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full"
              onClick={handleAddStudent}
            >
              Add Student
            </button>
          </div>
      
          {/* Student List */}
          <ul className="mt-4">
            {students.map((student) => (
              <li
                key={student._id}
                className="flex flex-col sm:flex-row justify-between items-center bg-gray-200 p-4 rounded mb-2"
              >
                <div className="flex-1">{student.name} - {student.phone}</div>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  {/* Edit Button */}
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded"
                    onClick={() => setEditStudent({ id: student._id, name: student.name, phone: student.phone })}
                  >
                    Edit
                  </button>
      
                  {/* Delete Button */}
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                    onClick={() => handleDeleteStudent(student._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
      
          {/* Edit Student Form */}
          {editStudent.id && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Name"
                value={editStudent.name}
                onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
                className="border rounded p-2 w-full mb-2"
              />
              <input
                type="text"
                placeholder="Phone"
                value={editStudent.phone}
                onChange={(e) => setEditStudent({ ...editStudent, phone: e.target.value })}
                className="border rounded p-2 w-full mb-4"
              />
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full w-full"
                onClick={handleUpdateStudent}
              >
                Update Student
              </button>
            </div>
          )}
        </div>
      </div>
      
    );
    
};

export default Home;
