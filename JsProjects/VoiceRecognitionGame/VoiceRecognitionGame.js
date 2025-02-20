const images = [
  { src: "fruitImages/apple.jpg", names: ["apple"] },
  { src: "fruitImages/banana.jpg", names: ["banana"] },
  { src: "fruitImages/orange.jpg", names: ["orange"] },
  { src: "fruitImages/avocado.jpg", names: ["avocado"] },
  { src: "fruitImages/carrot.jpg", names: ["carrot"] },
  { src: "fruitImages/eggplant.jpg", names: ["eggplant"] },
  { src: "fruitImages/grape.jpg", names: ["grape"] },
  { src: "fruitImages/kiwi.jpg", names: ["kiwi"] },
  { src: "fruitImages/peach.jpg", names: ["peach"] },
  { src: "fruitImages/pear.jpg", names: ["pear"] },
  { src: "fruitImages/strawberry.jpg", names: ["strawberry"] },
  { src: "fruitImages/tomato.jpg", names: ["tomato"] },
  { src: "fruitImages/watermelon.jpg", names: ["watermelon"] },
];

let currentImageIndex = 0;

document
  .getElementById("start-recognition-btn")
  .addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US"; // English language
    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript.toLowerCase();
      const resultElement = document.getElementById("result");
      const currentImageNames = images[currentImageIndex].names;

      console.log(`Recognized text: ${spokenText}`);
      console.log(`Expected texts: ${currentImageNames.join(", ")}`);

      const isMatch = currentImageNames.some(
        (name) => spokenText.includes(name) || name.includes(spokenText)
      );

      if (isMatch) {
        resultElement.textContent = "Correct!";
        resultElement.style.color = "green";
      } else {
        resultElement.textContent = "Try again!";
        resultElement.style.color = "red";
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  });

document.getElementById("prev-image-btn").addEventListener("click", () => {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  document.getElementById("displayed-image").src =
    images[currentImageIndex].src;
  clearResult();
});

document.getElementById("next-image-btn").addEventListener("click", () => {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  document.getElementById("displayed-image").src =
    images[currentImageIndex].src;
  clearResult();
});

function clearResult() {
  const resultElement = document.getElementById("result");
  resultElement.textContent = "";
}
