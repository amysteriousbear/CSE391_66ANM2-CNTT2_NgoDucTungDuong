// Trạng thái ứng dụng
let students = []; // Mảng gốc - Không bao giờ thay đổi trực tiếp khi lọc
let sortDirection = 0; // 0: none, 1: tăng, -1: giảm

const dom = {
    // ... các dom cũ ...
    search: document.getElementById('searchName'),
    filter: document.getElementById('filterGrade'),
    sortBtn: document.getElementById('sortScore'),
    sortIcon: document.getElementById('sortIcon'),
    tbody: document.getElementById('studentBody')
};

// --- HÀM CỐT LÕI: APPLY FILTERS ---
const applyFilters = () => {
    const keyword = dom.search.value.toLowerCase();
    const gradeCriteria = dom.filter.value;

    // Bước 1: Lọc (Filter)
    let result = students.filter(s => {
        const matchesName = s.name.toLowerCase().includes(keyword);
        const matchesGrade = gradeCriteria === "all" || calculateGrade(s.score) === gradeCriteria;
        return matchesName && matchesGrade;
    });

    // Bước 2: Sắp xếp (Sort)
    if (sortDirection !== 0) {
        result.sort((a, b) => (a.score - b.score) * sortDirection);
    }

    renderTable(result);
};

// --- HÀM RENDER ---
const renderTable = (dataToRender) => {
    if (dataToRender.length === 0) {
        dom.tbody.innerHTML = `<tr><td colspan="5">Không có kết quả phù hợp</td></tr>`;
        updateStats(0, 0); // Thống kê dựa trên kết quả lọc hoặc mảng gốc tùy nhu cầu
        return;
    }

    dom.tbody.innerHTML = dataToRender.map((s, index) => `
        <tr class="${s.score < 5 ? 'low-score' : ''}">
            <td>${index + 1}</td>
            <td>${s.name}</td>
            <td>${s.score.toFixed(1)}</td>
            <td><b>${calculateGrade(s.score)}</b></td>
            <td><button class="btn-delete" data-id="${s.id}">Xóa</button></td>
        </tr>
    `).join('');

    // Cập nhật thống kê dựa trên mảng gốc để phản ánh toàn bộ lớp
    const totalScore = students.reduce((sum, s) => sum + s.score, 0);
    updateStats(students.length, students.length > 0 ? totalScore / students.length : 0);
};

// --- XỬ LÝ SỰ KIỆN ---

// Tìm kiếm realtime
dom.search.addEventListener('input', applyFilters);

// Lọc theo xếp loại
dom.filter.addEventListener('change', applyFilters);

// Sắp xếp điểm
dom.sortBtn.addEventListener('click', () => {
    if (sortDirection === 0 || sortDirection === -1) sortDirection = 1; // Tăng
    else sortDirection = -1; // Giảm
    
    dom.sortIcon.innerText = sortDirection === 1 ? "▲" : "▼";
    applyFilters();
});

// Chỉnh sửa hàm thêm sinh viên để gọi applyFilters thay vì renderTable
const handleAddStudent = () => {
    // ... validation ...
    const newStudent = { id: Date.now(), name, score: parseFloat(scoreVal) };
    students.push(newStudent);
    applyFilters(); 
    // ... reset UI ...
};