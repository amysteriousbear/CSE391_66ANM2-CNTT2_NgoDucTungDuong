// Quản lý trạng thái (State)
let students = [];

// Truy vấn DOM một lần để tối ưu hiệu suất
const dom = {
    nameInput: document.getElementById('txtName'),
    scoreInput: document.getElementById('txtScore'),
    btnAdd: document.getElementById('btnAdd'),
    tbody: document.getElementById('studentBody'),
    total: document.getElementById('totalStudents'),
    avg: document.getElementById('avgScore')
};

// --- LOGIC NGHIỆP VỤ ---

const calculateGrade = (score) => {
    if (score >= 8.5) return "Giỏi";
    if (score >= 7.0) return "Khá";
    if (score >= 5.0) return "Trung bình";
    return "Yếu";
};

const updateStats = () => {
    const total = students.length;
    const avg = total === 0 ? 0 : students.reduce((sum, s) => sum + s.score, 0) / total;
    
    dom.total.textContent = total;
    dom.avg.textContent = avg.toFixed(2);
};

const renderTable = () => {
    dom.tbody.innerHTML = students.map((s, index) => `
        <tr class="${s.score < 5 ? 'low-score' : ''}">
            <td>${index + 1}</td>
            <td>${s.name}</td>
            <td>${s.score.toFixed(1)}</td>
            <td><b>${calculateGrade(s.score)}</b></td>
            <td><button class="btn-delete" data-index="${index}">Xóa</button></td>
        </tr>
    `).join('');
    
    updateStats();
};

// --- XỬ LÝ SỰ KIỆN ---

const handleAddStudent = () => {
    const name = dom.nameInput.value.trim();
    const scoreVal = dom.scoreInput.value;
    const score = parseFloat(scoreVal);

    // Validation 
    if (!name || scoreVal === "" || isNaN(score) || score < 0 || score > 10) {
        alert("Vui lòng nhập tên và điểm hợp lệ (0-10)!");
        return;
    }

    students.push({ name, score });
    renderTable();

    // Reset UI
    dom.nameInput.value = "";
    dom.scoreInput.value = "";
    dom.nameInput.focus();
};

// 1. Lắng nghe nút Thêm
dom.btnAdd.addEventListener('click', handleAddStudent);

// 2. Lắng nghe phím Enter
dom.scoreInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddStudent();
});

// 3. Event Delegation cho nút Xóa
dom.tbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        
        // xác nhận trước khi xóa dữ liệu
        if (confirm(`Bạn có chắc muốn xóa sinh viên ${students[index].name}?`)) {
            students.splice(index, 1);
            renderTable();
        }
    }
});