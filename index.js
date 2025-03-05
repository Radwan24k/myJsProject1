// Form validation function
function validateForm(event) {
  event.preventDefault(); // Prevent form submission

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  let isValid = true;
  let errorMessage = "";

  // Validate name
  if (name === "") {
    isValid = false;
    errorMessage += "Name is required.\n";
  }

  // Validate email
  if (email === "") {
    isValid = false;
    errorMessage += "Email is required.\n";
  } else if (!validateEmail(email)) {
    isValid = false;
    errorMessage += "Invalid email format.\n";
  }

  // Validate message
  if (message === "") {
    isValid = false;
    errorMessage += "Message is required.\n";
  }

  if (isValid) {
    alert("Form submitted successfully!");
    // You can submit the form here if needed
    // document.querySelector("form").submit();
  } else {
    alert(errorMessage);
  }
}

// Email validation function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Attach the validation function to the form submit event
const form = document.querySelector("form");
form.addEventListener("submit", validateForm);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Scroll to top button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Lazy loading images
document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll("img.lazy");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => {
    imageObserver.observe(img);
  });
});
