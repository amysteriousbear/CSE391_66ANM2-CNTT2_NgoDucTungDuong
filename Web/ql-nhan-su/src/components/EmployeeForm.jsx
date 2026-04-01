import React, { useState } from 'react';

const EmployeeForm = ({ onAdd }) => {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', position: '' });
  const [errors, setErrors] = useState({});

  // Logic Validation - "Tấm khiên" bảo vệ dữ liệu
  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;

    if (!form.fullName.trim()) tempErrors.fullName = "Họ tên không được để trống";
    if (!emailRegex.test(form.email)) tempErrors.email = "Email không đúng định dạng (VD: abc@gmail.com)";
    if (!phoneRegex.test(form.phone)) tempErrors.phone = "SĐT Việt Nam phải có 10 số (03/05/07/08/09...)";
    if (!form.position) tempErrors.position = "Vui lòng chọn vị trí";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onAdd(form);
      setForm({ fullName: '', email: '', phone: '', position: '' }); // Reset
      setErrors({}); // Xóa lỗi cũ
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-white">
      <h5 className="mb-3 text-primary">Thêm Nhân Viên Mới</h5>
      
      <div className="mb-3">
        <input 
          className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
          placeholder="Họ Tên" 
          value={form.fullName}
          onChange={e => setForm({...form, fullName: e.target.value})} 
        />
        <div className="invalid-feedback">{errors.fullName}</div>
      </div>

      <div className="mb-3">
        <input 
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          type="email" placeholder="Email" 
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})} 
        />
        <div className="invalid-feedback">{errors.email}</div>
      </div>

      <div className="mb-3">
        <input 
          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          placeholder="Số điện thoại (10 số)" 
          value={form.phone}
          onChange={e => setForm({...form, phone: e.target.value})} 
        />
        <div className="invalid-feedback">{errors.phone}</div>
      </div>

      <div className="mb-3">
        <select 
          className={`form-select ${errors.position ? 'is-invalid' : ''}`}
          value={form.position}
          onChange={e => setForm({...form, position: e.target.value})}
        >
          <option value="">-- Chọn Vị trí --</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Tester">Tester</option>
        </select>
        <div className="invalid-feedback">{errors.position}</div>
      </div>

      <button className="btn btn-success w-100 fw-bold">XÁC NHẬN THÊM</button>
    </form>
  );
};

export default EmployeeForm;