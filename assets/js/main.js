// Select elements for the price sliders and their display
const minSlider = document.getElementById("minSlider");
const maxSlider = document.getElementById("maxSlider");
const minValue = document.getElementById("minValue");
const maxValue = document.getElementById("maxValue");
const sliderContainer = document.querySelector(".range-slider");

// Select all price elements and format them
document.querySelectorAll("#price").forEach((priceElement) => {
  let rawPriceText = priceElement.textContent.trim();
  let priceValue = parseFloat(rawPriceText.replace(/[^0-9]/g, ""));
  priceElement.textContent = formatCurrency(priceValue, "VND");
});

function formatCurrency(value, currency = "VND") {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: currency,
  });
}

// Accordion functionality
document.querySelectorAll(".accordion-item-header").forEach((header) => {
  header.addEventListener("click", () => {
    header.classList.toggle("active");
    const body = header.nextElementSibling;
    body.style.maxHeight = header.classList.contains("active")
      ? body.scrollHeight + "px"
      : 0;
  });
});

document
  .querySelectorAll('.color-item input[type="checkbox"]')
  .forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const colorBox = e.target.nextElementSibling;
      const icon = checkbox.nextElementSibling; // Lấy thẻ <i>
      if (e.target.checked) {
        colorBox.style.border = "2px solid red"; // Đặt viền khi chọn
        colorBox.style.borderRadius = "10px";
        icon.style.display = "inline";
      } else {
        icon.style.display = "none";
        colorBox.style.border = "2px solid transparent"; // Xóa viền khi bỏ chọn
      }
    });
  });

// Heart icon click event
document.querySelectorAll(".heart-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    alert("Đã thêm sản phẩm vào danh sách yêu thích");
  });
});

// Filter products based on selected colors and price
const colorCheckboxes = document.querySelectorAll(
  ".list-color input[type='checkbox']"
);

const products = document.querySelectorAll(".product-item");

// Show all products initially
products.forEach((product) => (product.style.display = "block"));

colorCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", filterProducts);
});

function filterProducts() {
  const selectedColors = Array.from(colorCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  products.forEach((product) => {
    const productColors = product.getAttribute("data-colors").split(",");

    const matchesColor =
      selectedColors.length === 0 ||
      selectedColors.some((color) => productColors.includes(color));

    const matchesPrice = filterByPrice(product);

    product.style.display = matchesColor && matchesPrice ? "block" : "none";
  });

  const unisexCheckbox = document.getElementById("abst");
  unisexCheckbox.addEventListener("change", () => {
    if (unisexCheckbox.checked) {
      products.forEach((product) => {
        product.style.display = "block";
      });
    } else {
      console.log("Unisex bị bỏ chọn");
    }
  });
}

function filterByPrice(product) {
  const minPrice = parseInt(minSlider.value);
  const maxPrice = parseInt(maxSlider.value);
  const priceElement = product.querySelector(".pra");
  if (!priceElement) return true;

  const priceText = priceElement.textContent.trim();
  const productPrice = parseInt(priceText.replace(/\D/g, ""));

  return productPrice >= minPrice && productPrice <= maxPrice;
}

function updateSlider() {
  const min = parseInt(minSlider.value);

  const max = parseInt(maxSlider.value);

  if (min > max - 10) {
    minSlider.value = max - 10;
  }
  if (max < min + 10) {
    maxSlider.value = min + 10;
  }

  minValue.textContent = minSlider.value;
  maxValue.textContent = maxSlider.value;

  const percentMin = (minSlider.value / minSlider.max) * 100;
  const percentMax = (maxSlider.value / maxSlider.max) * 100;

  sliderContainer.style.setProperty("--min", percentMin + "%");
  sliderContainer.style.setProperty("--max", percentMax + "%");

  filterProducts();
}

updateSlider();
minSlider.addEventListener("input", updateSlider);
maxSlider.addEventListener("input", updateSlider);

// Cập nhật giá trị và định dạng chúng
function updatePriceDisplay() {
  const minValueElement = document.getElementById("minValue");
  const maxValueElement = document.getElementById("maxValue");

  // Lấy giá trị từ các slider
  const minPrice = parseInt(minSlider.value);
  const maxPrice = parseInt(maxSlider.value);

  // Định dạng giá trị theo dạng tiền tệ
  minValueElement.textContent = minPrice.toLocaleString("vi-VN"); // Định dạng giá trị min
  maxValueElement.textContent = maxPrice.toLocaleString("vi-VN"); // Định dạng giá trị max
}

// Gọi hàm khi trang tải hoặc khi có thay đổi giá trị từ thanh trượt
updatePriceDisplay();
minSlider.addEventListener("input", updatePriceDisplay);
maxSlider.addEventListener("input", updatePriceDisplay);

// Add To Cart
let cart = []; // Mảng chứa sản phẩm trong giỏ hàng

// Hàm lưu giỏ hàng vào Local Storage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Hàm tải giỏ hàng từ Local Storage
function loadCart() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Hàm cập nhật số lượng sản phẩm hiển thị
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalQuantity; // Cập nhật số lượng vào phần tử giỏ hàng
}

function addBasketShakeEffect() {
  const cartCount = parseInt(document.getElementById("cart-count").textContent); // Lấy số lượng trong giỏ hàng
  const cartIcon = document.getElementById("ico-main"); // Phần tử biểu tượng giỏ hàng

  if (cartCount > 0) {
    cartIcon.classList.add("basket-shake");
    console.log(cartIcon.classList.add("basket-shake"));
    
    // Xóa class "basket-shake" sau khi hiệu ứng hoàn tất
    setTimeout(() => {
      cartIcon.classList.remove("basket-shake");
    }, 1000);
  }
}

// Gắn sự kiện cho các nút Add to Cart
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productElement = button.closest(".product-item");
    const productId = button.getAttribute("data-id");
    const productName =
      productElement.querySelector(".name-product").textContent;
    const productPrice = productElement.querySelector(".pra").textContent;
    const productImage = productElement.querySelector(".img-product img").src;

    // Tạo đối tượng sản phẩm mới
    const product = {
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1, // Mặc định số lượng là 1
    };

    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingProduct = cart.find((item) => item.id === productId);
    if (!existingProduct) {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
      cart.push(product);
      alert(`Đã thêm "${productName}" vào giỏ hàng!`);
    } else {
      // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
      existingProduct.quantity += 1;
      alert(
        `Sản phẩm "${productName}" đã có trong giỏ hàng, số lượng đã được tăng lên!`
      );
    }

    renderCart(); // Cập nhật lại giao diện giỏ hàng
    addBasketShakeEffect(); // Thêm hiệu ứng rung lắc
    saveCart(); // Lưu giỏ hàng vào Local Storage
    updateCartCount(); // Cập nhật số lượng sản phẩm trong giỏ hàng
  });
});

function decreaseQuantity(productId) {
  const product = cart.find((item) => item.id === productId);
  if (product && product.quantity > 1) {
    product.quantity -= 1;
    updateCartCount(); // Cập nhật lại số lượng giỏ hàng sau khi giảm
    saveCart(); // Lưu giỏ hàng vào Local Storage
    renderCart(); // Cập nhật lại giao diện giỏ hàng
  }
}

function renderCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = ""; // Xóa danh sách cũ
  if (cart.length === 0) {
    // Nếu giỏ hàng trống, hiển thị thông báo
    const emptyMessage = document.createElement("h2");
    emptyMessage.textContent = "Giỏ hàng của bạn đang trống!";
    emptyMessage.style.textAlign = "center"; // Căn giữa thông báo
    emptyMessage.style.marginTop = "60px"; 
    emptyMessage.style.color = "red"; // Màu chữ thông báo
    emptyMessage.style.fontStyle = "italic"; 
    cartList.appendChild(emptyMessage);
    return; // Dừng lại nếu giỏ hàng rỗng
  }
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="list-cart-shopping">
        <img src="${item.image}" alt="${item.name}" width="50">
        <span>${item.name}</span>
        <div class="quantity-controls">
          <button class="decrease" data-id="${item.id}">-</button>
          <span class="quantity" id="quantity-${item.id}">${item.quantity}</span>
          <button class="increase" data-id="${item.id}">+</button>
        </div>
        <button class="remove-item" data-id="${item.id}"><i class='bx bxs-trash'></i></button>
      </div>
    `;
    cartList.appendChild(li);
  });

  // Gắn sự kiện cho các nút "Xóa"
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.currentTarget.getAttribute("data-id"); // Lấy data-id từ nút chứa <i>
      removeFromCart(productId); // Xóa sản phẩm khỏi giỏ hàng
    });
  });

  // Gắn sự kiện cho các nút tăng/giảm số lượng
  document.querySelectorAll(".increase").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-id");
      updateQuantity(productId, 1); // Tăng số lượng
    });
  });

  document.querySelectorAll(".decrease").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-id");
      updateQuantity(productId, -1); // Giảm số lượng
    });
  });
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
  // Tìm sản phẩm và xóa nó khỏi giỏ hàng
  cart = cart.filter((item) => item.id !== productId);

  // Lưu giỏ hàng vào Local Storage
  saveCart();

  // Cập nhật giao diện giỏ hàng
  renderCart();

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartCount();
}

// Hàm cập nhật số lượng sản phẩm
function updateQuantity(productId, change) {
  // Tìm sản phẩm trong giỏ hàng
  const product = cart.find((item) => item.id === productId);
  if (product) {
    // Thay đổi số lượng (kiểm tra không để số lượng < 1)
    product.quantity = Math.max(1, product.quantity + change);

    // Cập nhật giỏ hàng và giao diện
    saveCart(); // Lưu giỏ hàng vào Local Storage
    renderCart(); // Cập nhật lại giao diện
    updateCartCount(); // Cập nhật số lượng sản phẩm trong giỏ hàng
  }
}

// Block Shopping Cart
function blockShoppingCart() {
  const showCartPhopping = document.getElementById("cart-modal");
  const showCartModll = document.getElementById("block-cart-shopping");
  const closeModer = document.getElementById("close-model");
  showCartModll.addEventListener("click", () => {
    showCartPhopping.style.display = "block";

  });

  closeModer.addEventListener("click", () => {
    showCartPhopping.style.display = "none";
  });
}

blockShoppingCart();
// Khi tải lại trang, đọc giỏ hàng từ Local Storage và cập nhật giao diện
loadCart();
updateCartCount();
renderCart();
