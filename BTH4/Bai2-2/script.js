const prices = {
    "Laptop": 20000000,
    "Smartphone": 10000000,
    "Keyboard": 1500000
};

const form = document.getElementById('order-form');
const productEl = document.getElementById('product');
const quantityEl = document.getElementById('quantity');
const totalPriceEl = document.getElementById('total-price');
const noteEl = document.getElementById('note');
const charCountEl = document.getElementById('char-count');
const overlay = document.getElementById('overlay');

// --- 1. TÍNH TỔNG TIỀN TỰ ĐỘNG ---
function updateTotalPrice() {
    const product = productEl.value;
    const quantity = parseInt(quantityEl.value) || 0;
    const price = prices[product] || 0;
    const total = price * quantity;
    totalPriceEl.innerText = total.toLocaleString("vi-VN");
}

productEl.addEventListener('change', updateTotalPrice);
quantityEl.addEventListener('input', updateTotalPrice);

// --- 2. ĐẾM KÝ TỰ REALTIME ---
noteEl.addEventListener('input', () => {
    const len = noteEl.value.length;
    charCountEl.innerText = `${len}/200`;
    
    if (len > 200) {
        charCountEl.classList.add('over-limit');
        document.getElementById('err-note').innerText = "Ghi chú không được quá 200 ký tự!";
    } else {
        charCountEl.classList.remove('over-limit');
        document.getElementById('err-note').innerText = "";
    }
});

// --- 3. VALIDATION HÀM CHUNG ---
function validateForm() {
    let isValid = true;
    const today = new Date();
    today.setHours(0,0,0,0); // Đưa về 0h để so sánh ngày

    // Validate Sản phẩm
    if (!productEl.value) {
        showError('product', "Vui lòng chọn sản phẩm!");
        isValid = false;
    }

    // Validate Số lượng
    const qty = parseInt(quantityEl.value);
    if (isNaN(qty) || qty < 1 || qty > 99) {
        showError('quantity', "Số lượng phải từ 1 đến 99!");
        isValid = false;
    }

    // Validate Ngày
    const inputDate = new Date(document.getElementById('delivery-date').value);
    const diffTime = inputDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (isNaN(inputDate.getTime()) || diffDays < 0 || diffDays > 30) {
        showError('date', "Ngày giao từ hôm nay đến tối đa 30 ngày tới!");
        isValid = false;
    }

    // Validate Địa chỉ
    if (document.getElementById('address').value.trim().length < 10) {
        showError('address', "Địa chỉ phải từ 10 ký tự trở lên!");
        isValid = false;
    }

    // Validate Phương thức thanh toán
    const payment = document.querySelector('input[name="payment"]:checked');
    if (!payment) {
        showError('payment', "Vui lòng chọn phương thức thanh toán!");
        isValid = false;
    }

    return isValid;
}

function showError(id, msg) {
    document.getElementById(`err-${id}`).innerText = msg;
}

// Xóa lỗi khi người dùng nhập lại
form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
        const errId = `err-${el.id || el.name}`;
        const errEl = document.getElementById(errId);
        if (errEl) errEl.innerText = "";
    });
});

// --- 4. XỬ LÝ SUBMIT & XÁC NHẬN ---
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
        const summary = `
            <p>Sản phẩm: ${productEl.value}</p>
            <p>Số lượng: ${quantityEl.value}</p>
            <p>Tổng tiền: ${totalPriceEl.innerText} VNĐ</p>
            <p>Ngày giao: ${document.getElementById('delivery-date').value}</p>
        `;
        document.getElementById('summary-content').innerHTML = summary;
        overlay.style.display = 'flex';
    }
});

document.getElementById('btn-cancel').onclick = () => overlay.style.display = 'none';
document.getElementById('btn-confirm').onclick = () => {
    alert("Chúc mừng! Đơn hàng của bạn đã được hệ thống ghi nhận.");
    overlay.style.display = 'none';
    form.reset();
    updateTotalPrice();
};