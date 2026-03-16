/**
 * Mọi thứ vận hành theo luồng: Dữ liệu (State) -> Bộ lọc (Pipeline) -> Hiển thị (UI).
 */

// 1. TRẠNG THÁI ỨNG DỤNG (STATE)
let students = []; 
let sortDirection = 0; // 0: không sắp xếp, 1: tăng dần, -1: giảm dần

// 2. TRUY VẤN CÁC PHẦN TỬ GIAO DIỆN (DOM)
const dom = {
    nameInput: document.getElementById('txtName'),
    scoreInput: document.getElementById('txtScore'),
    btnAdd: document.getElementById('btnAdd'),
    search: document.getElementById('searchName'),
    filter: document.getElementById('filterGrade'),
    sortBtn: document.getElementById('sortScore'),
    sortIcon: document.getElementById('sortIcon'),
    tbody: document.getElementById('studentBody'),
    total: document.getElementById('totalStudents'),
    avg: document.getElementById('avgScore')
};

// 3. CÁC HÀM BỔ TRỢ (HELPER FUNCTIONS)
const calculateGrade = (score) => {
    if (score >= 8.5) return "Giỏi";
    if (score >= 7.0) return "Khá";
    if (score >= 5.0) return "Trung bình";
    return "Yếu";
};

const updateStats = () => {
    const total = students.length;
    const sum = students.reduce((acc, curr) => acc + curr.score, 0);
    const avg = total === 0 ? 0 : sum / total;
    
    // Cập nhật số liệu xuống chân bảng
    if(dom.total) dom.total.textContent = total;
    if(dom.avg) dom.avg.textContent = avg.toFixed(2);
};

// 4. HÀM CỐT LÕI: ĐƯỜNG ỐNG XỬ LÝ DỮ LIỆU (PIPELINE)
const applyFilters = () => {
    const keyword = dom.search.value.toLowerCase();
    const gradeCriteria = dom.filter.value;

    // Trạm 1: Lọc theo tên và theo xếp loại
    let result = students.filter(s => {
        const matchesName = s.name.toLowerCase().includes(keyword);
        const matchesGrade = gradeCriteria === "all" || calculateGrade(s.score) === gradeCriteria;
        return matchesName && matchesGrade;
    });

    // Trạm 2: Sắp xếp theo điểm (nếu có yêu cầu)
    if (sortDirection !== 0) {
        result.sort((a, b) => (a.score - b.score) * sortDirection);
    }

    // Trạm 3: Gửi dữ liệu đã xử lý đi hiển thị
    renderTable(result);
};

// 5. HÀM HIỂN THỊ (RENDER)
const renderTable = (dataToRender) => {
    if (dataToRender.length === 0) {
        dom.tbody.innerHTML = `<tr><td colspan="5" style="padding:20px; color:gray;">Không tìm thấy kết quả phù hợp</td></tr>`;
    } else {
        dom.tbody.innerHTML = dataToRender.map((s, index) => `
            <tr class="${s.score < 5 ? 'low-score' : ''}">
                <td>${index + 1}</td>
                <td>${s.name}</td>
                <td>${s.score.toFixed(1)}</td>
                <td><b>${calculateGrade(s.score)}</b></td>
                <td><button class="btn-delete" data-id="${s.id}">Xóa</button></td>
            </tr>
        `).join('');
    }
    updateStats(); // Luôn tính lại thống kê dựa trên mảng gốc
};

// 6. QUẢN LÝ SỰ KIỆN (EVENT LISTENERS)

// Sự kiện Thêm sinh viên
const handleAddStudent = () => {
    const name = dom.nameInput.value.trim();
    const scoreVal = dom.scoreInput.value;
    const score = parseFloat(scoreVal);

    // Kiểm tra dữ liệu đầu vào (Validation)
    if (!name || scoreVal === "" || isNaN(score) || score < 0 || score > 10) {
        alert("Vui lòng nhập tên và điểm hợp lệ (0-10)!");
        return;
    }

    // Thêm vào mảng gốc với ID duy nhất
    students.push({ 
        id: Date.now(), 
        name: name, 
        score: score 
    });

    applyFilters(); // Chạy lại đường ống lọc để cập nhật UI

    // Xóa trắng form và đưa con trỏ về ô tên
    dom.nameInput.value = "";
    dom.scoreInput.value = "";
    dom.nameInput.focus();
};

// Gán sự kiện cho các nút và ô nhập
dom.btnAdd.addEventListener('click', handleAddStudent);
dom.search.addEventListener('input', applyFilters);
dom.filter.addEventListener('change', applyFilters);

// Hỗ trợ phím Enter ở ô điểm
dom.scoreInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddStudent();
});

// Sự kiện Sắp xếp
dom.sortBtn.addEventListener('click', () => {
    if (sortDirection === 0 || sortDirection === -1) sortDirection = 1; // Đổi sang Tăng
    else sortDirection = -1; // Đổi sang Giảm
    
    dom.sortIcon.innerText = sortDirection === 1 ? "▲" : "▼";
    applyFilters();
});

// Sự kiện Xóa (Dùng Event Delegation)
dom.tbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        const idToDelete = parseInt(e.target.getAttribute('data-id'));
        const studentIndex = students.findIndex(s => s.id === idToDelete);
        
        if (studentIndex !== -1) {
            if (confirm(`Bạn có chắc muốn xóa sinh viên: ${students[studentIndex].name}?`)) {
                students.splice(studentIndex, 1); // Xóa trong mảng gốc
                applyFilters(); // Vẽ lại bảng sau khi xóa
            }
        }
    }
});