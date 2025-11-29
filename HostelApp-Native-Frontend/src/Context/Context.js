import React, { createContext, useEffect, useState } from "react";
// import firestore from "@react-native-firebase/firestore";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  // Base states
  const [baseIp, setBaseIp] = useState("http://192.168.43.137:3000");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auth states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [studentData, setStudentData] = useState(null);

  // Data states
  const [students, setStudents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [myLogs, setMyLogs] = useState([]);

  useEffect(() => {
    // const fetchIp = async () => {
    //   try {
    //     const snapshot = await firestore()
    //       .collection("iplogs")
    //       .limit(1)
    //       .get();

    //     if (!snapshot.empty) {
    //       const ipData = snapshot.docs[0].data().ip;
    //       setBaseIp(`${ipData}`);
    //       console.log("Server IP:", `${ipData}`);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching IP:", error);
    //   }
    // };

    // fetchIp();
    checkExistingLogin();
  }, []);

  const checkExistingLogin = async () => {
    try {
      const adminToken = await AsyncStorage.getItem('adminToken');
      const studentToken = await AsyncStorage.getItem('studentToken');
      const adminInfo = await AsyncStorage.getItem('adminData');
      const studentInfo = await AsyncStorage.getItem('studentData');

      if (adminToken && adminInfo) {
        setIsAdminLoggedIn(true);
        setAdminData(JSON.parse(adminInfo));
      } else if (studentToken && studentInfo) {
        setIsStudentLoggedIn(true);
        setStudentData(JSON.parse(studentInfo));
      }
    } catch (err) {
      console.error('Error checking login:', err);
    }
  };

  const clearError = () => setError(null);

  // ------------------ ADMIN APIs ------------------
  const adminLogin = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseIp}/login`, { username, password });
      
      if (response.data.status === "success") {
        await AsyncStorage.setItem('adminToken', 'true');
        await AsyncStorage.setItem('adminData', JSON.stringify(response.data));
        setAdminData(response.data);
        setIsAdminLoggedIn(true);
      }
      return response.data;
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogout = async () => {
    setIsLoading(true);
    try {
      await axios.get(`${baseIp}/logout`);
      await AsyncStorage.removeItem('adminToken');
      await AsyncStorage.removeItem('adminData');
      setIsAdminLoggedIn(false);
      setAdminData(null);
    } catch (err) {
      setError(err?.response?.data?.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addStudent = async (formData) => {
    setIsLoading(true);
    try {
      console.log('Adding student to:', `${baseIp}/add_student`);
      const response = await axios.post(`${baseIp}/add_student`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });
      
      console.log('Add student response:', response.status, response.data);
      
      // Check for successful response 
      if (response.status === 201 && response.data.status === "success") {
        // Don't try to refresh students list since /students endpoint is broken
        // Just return success
        return response.data;
      }
      
      return response.data;
    } catch (err) {
      console.error('Add student error:', err);
      setError(err?.response?.data?.message || "Failed to add student");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const editStudent = async (id, formData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseIp}/edit_student/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status === "success") {
        // Don't refresh students since endpoint is broken
      }
      return response.data;
    } catch (err) {
      setError(err?.response?.data?.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      console.log('Fetching students from:', `${baseIp}/students`);
      const response = await axios.get(`${baseIp}/students`, {
        timeout: 10000,
      });
      
      // This will never execute because Flask throws 500 error
      if (response.data.status === "success") {
        const studentsData = response.data.students.map(student => {
          const { face_encoding, ...rest } = student;
          return rest;
        });
        setStudents(studentsData);
      }
      return response.data;
    } catch (err) {
      console.error('Fetch students error - Status:', err?.response?.status);
      
      // Handle the 500 error from Flask bytes serialization issue
      if (err?.response?.status === 500) {
        console.log('Flask /students endpoint has bytes serialization error');
        
        // Create mock data based on what would be in database
        // Since we can't fetch from the broken endpoint, we'll set empty array
        // and provide a helpful error message
        setStudents([]);
        setError("Students list temporarily unavailable due to server configuration. New students can still be added.");
        
        // Return a structured response so the UI doesn't break
        return { 
          status: "error", 
          message: "Server configuration issue",
          students: [] 
        };
      }
      
      // Handle other errors normally
      setError(err?.response?.data?.message || "Failed to fetch students");
      setStudents([]);
      return { status: "error", students: [] };
    }
  };

  const deleteStudent = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${baseIp}/delete_student/${id}`);
      if (response.data.status === "success") {
        // Don't try to refresh students list since endpoint is broken
        // Just remove from local state
        setStudents(prevStudents => prevStudents.filter(s => s.id !== id));
      }
      return response.data;
    } catch (err) {
      setError(err?.response?.data?.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${baseIp}/view_logs`);
      if (response.data.status === "success") {
        setLogs(response.data.logs);
      }
      return response.data;
    } catch (err) {
      setError(err?.response?.data?.message);
      throw err;
    }
  };

  // ------------------ STUDENT APIs ------------------
  const studentLogin = async (name, register_no) => {
    // setIsLoading(true);
    try {
      const response = await axios.post(`${baseIp}/student/login`, {
        name,
        register_no: parseInt(register_no)
      });
      
      if (response.data.status === "success") {
        await AsyncStorage.setItem('studentToken', 'true');
        await AsyncStorage.setItem('studentData', JSON.stringify(response.data));
        setStudentData(response.data);
        setIsStudentLoggedIn(true);
      }
      return response.data;
    } catch (err) {
      setError(err?.response?.data?.message);
      throw err;
    } finally {
      // setIsLoading(false);
    }
  };

  const studentLogout = async () => {
    setIsLoading(true);
    try {
      await axios.get(`${baseIp}/student/logout`);
      await AsyncStorage.removeItem('studentToken');
      await AsyncStorage.removeItem('studentData');
      setIsStudentLoggedIn(false);
      setStudentData(null);
    } catch (err) {
      setError(err?.response?.data?.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyLogs = async (studentId) => {
    // setIsLoading(true);
    try {
      const response = await axios.get(`${baseIp}/my_logs?student_id=${studentId}`);
      if (response.data.status === "success") {
        setMyLogs(response.data.logs);
      }
      return response.data;
    } catch (err) {
      setError(err?.response?.data?.message);
      throw err;
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <ApiContext.Provider
      value={{
        // States
        isAdminLoggedIn,
        isStudentLoggedIn,
        adminData,
        studentData,
        isLoading,
        error,
        baseIp,
        students,
        logs,
        myLogs,
        
        // Admin functions
        adminLogin,
        adminLogout,
        addStudent,
        editStudent,
        fetchStudents,
        deleteStudent,
        fetchLogs,
        
        // Student functions
        studentLogin,
        studentLogout,
        fetchMyLogs,
        
        // Utility
        clearError
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
