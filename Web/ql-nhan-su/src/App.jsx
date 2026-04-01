import React, { useState, useEffect } from 'react';
import { initialEmployees } from './data.js';
import EmployeeForm from './components/EmployeeForm.jsx';
import EmployeeTable from './components/EmployeeTable.jsx';

const App = () => {
  // Lấy dữ liệu từ LocalStorage hoặc dùng data.js nếu trống
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees_data");
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  // Tự động lưu mỗi khi danh sách thay đổi (Side Effect)
  useEffect(() => {
    localStorage.setItem("employees_data", JSON.stringify(employees));
  }, [employees]);

  const addEmployee = (newEmployee) => {
    setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Hệ Thống Quản Lý Nhân Sự</h2>
      <div className="row">
        <div className="col-md-4"><EmployeeForm onAdd={addEmployee} /></div>
        <div className="col-md-8"><EmployeeTable data={employees} /></div>
      </div>
    </div>
  );
};

export default App;