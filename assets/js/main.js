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
        products.forEach(product => {
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
  