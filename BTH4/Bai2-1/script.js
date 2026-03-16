const form = document.getElementById('registrationForm');
const successDiv = document.getElementById('successMessage');

// --- Helpers ---
const showError = (id, msg) => {
    const input = document.getElementById(id) || document.getElementsByName(id)[0];
    if(input.type !== 'radio' && input.type !== 'checkbox') input.classList.add('invalid');
    document.getElementById(`${id}-error`).innerText = msg;
};

const clearError = (id) => {
    const input = document.getElementById(id) || document.getElementsByName(id)[0];
    input.classList.remove('invalid');
    document.getElementById(`${id}-error`).innerText = '';
};

// --- Validation Logic ---
const validateFullname = () => {
    const val = document.getElementById('fullname').value.trim();
    const regex = /^[a-zA-ZÀ-ỹ\s]{3,}$/;
    if (!val) { showError('fullname', 'Họ tên không được để trống'); return 0; }
    if (!regex.test(val)) { showError('fullname', 'Tối thiểu 3 ký tự, chỉ chứa chữ cái'); return 0; }
    clearError('fullname'); return 1;
};

const validateEmail = () => {
    const val = document.getElementById('email').value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) { showError('email', 'Email không được để trống'); return 0; }
    if (!regex.test(val)) { showError('email', 'Định dạng email không hợp lệ'); return 0; }
    clearError('email'); return 1;
};

const validatePhone = () => {
    const val = document.getElementById('phone').value.trim();
    const regex = /^0\d{9}$/;
    if (!regex.test(val)) { showError('phone', 'SĐT phải có 10 số và bắt đầu bằng 0'); return 0; }
    clearError('phone'); return 1;
};

const validatePassword = () => {
    const val = document.getElementById('password').value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regex.test(val)) { showError('password', 'Mật khẩu yếu (8 ký tự, 1 hoa, 1 thường, 1 số)'); return 0; }
    clearError('password'); return 1;
};

const validateConfirmPassword = () => {
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (!confirm || confirm !== pass) { showError('confirmPassword', 'Mật khẩu xác nhận không khớp'); return 0; }
    clearError('confirmPassword'); return 1;
};

const validateGender = () => {
    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) { showError('gender', 'Vui lòng chọn giới tính'); return 0; }
    clearError('gender'); return 1;
};

const validateTerms = () => {
    const checked = document.getElementById('terms').checked;
    if (!checked) { showError('terms', 'Bạn phải đồng ý với điều khoản'); return 0; }
    clearError('terms'); return 1;
};

// --- Event Listeners ---

// Realtime: Blur & Input
const inputs = [
    { id: 'fullname', fn: validateFullname },
    { id: 'email', fn: validateEmail },
    { id: 'phone', fn: validatePhone },
    { id: 'password', fn: validatePassword },
    { id: 'confirmPassword', fn: validateConfirmPassword }
];

inputs.forEach(item => {
    const el = document.getElementById(item.id);
    el.addEventListener('blur', item.fn);
    el.addEventListener('input', () => clearError(item.id));
});

// Case đặc biệt cho Radio & Checkbox
document.getElementsByName('gender').forEach(r => r.addEventListener('change', validateGender));
document.getElementById('terms').addEventListener('change', validateTerms);

// Submit Handler
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Sử dụng toán tử BITWISE & để ép tất cả các hàm validate phải thực thi
    // Nếu dùng &&, JS sẽ dừng ngay khi gặp hàm đầu tiên trả về false (short-circuit)
    const isValid = validateFullname() & 
                    validateEmail() & 
                    validatePhone() & 
                    validatePassword() & 
                    validateConfirmPassword() & 
                    validateGender() & 
                    validateTerms();

    if (isValid) {
        const name = document.getElementById('fullname').value;
        form.classList.add('hidden');
        successDiv.innerHTML = `Đăng ký thành công! 🎉<br><small>Chào mừng, ${name}!</small>`;
        successDiv.classList.remove('hidden');
    }
});