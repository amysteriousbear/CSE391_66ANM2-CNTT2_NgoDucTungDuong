const EmployeeTable = ({ data }) => (
  <table className="table table-hover border">
    <thead className="table-dark">
      <tr>
        <th>STT</th>
        <th>Họ Tên</th>
        <th>Email</th>
        <th>SĐT</th>
        <th>Vị trí</th>
        <th>Hành động</th>
      </tr>
    </thead>
    <tbody>
      {data.map((emp, index) => (
        <tr key={emp.id}>
          <td>{index + 1}</td>
          <td>{emp.fullName}</td>
          <td>{emp.email}</td>
          <td>{emp.phone}</td>
          <td><span className="badge bg-info">{emp.position}</span></td>
          <td><button className="btn btn-sm btn-danger">Xóa</button></td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default EmployeeTable;

//