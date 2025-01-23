const timeZones = [
  { name: "India", zone: "Asia/Kolkata" },
  { name: "New York", zone: "America/New_York" },
  { name: "London", zone: "Europe/London" },
  { name: "Tokyo", zone: "Asia/Tokyo" },
  { name: "Sydney", zone: "Australia/Sydney" },
  { name: "Dubai", zone: "Asia/Dubai" },
  { name: "San Francisco", zone: "America/Los_Angeles" },
];

let isAnalog = true;
let isDarkTheme = true;

function formatTime(date, timeZone) {
  return date.toLocaleTimeString("en-US", {
    timeZone,
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDate(date, timeZone) {
  return date.toLocaleDateString("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function createAnalogClock() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");

  // Clock face
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("cx", "50");
  circle.setAttribute("cy", "50");
  circle.setAttribute("r", "45");
  circle.setAttribute("fill", isDarkTheme ? "#1a202c" : "#ffffff");
  circle.setAttribute("stroke", isDarkTheme ? "#4a5568" : "#e2e8f0");
  circle.setAttribute("stroke-width", "2");

  svg.appendChild(circle);

  // Hour markers and numbers
  for (let i = 1; i <= 12; i++) {
    // Add number
    const number = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const radius = 33;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);

    number.setAttribute("x", x.toString());
    number.setAttribute("y", y.toString());
    number.setAttribute("text-anchor", "middle");
    number.setAttribute("dominant-baseline", "middle");
    number.setAttribute("font-size", "8");
    number.setAttribute("font-weight", "bold");
    number.setAttribute("fill", isDarkTheme ? "#e2e8f0" : "#2d3748");
    number.textContent = i.toString();

    // Add hour marker
    const marker = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    const markerAngle = i * 30 * (Math.PI / 180);
    const x1 = 50 + 40 * Math.sin(markerAngle);
    const y1 = 50 - 40 * Math.cos(markerAngle);
    const x2 = 50 + 45 * Math.sin(markerAngle);
    const y2 = 50 - 45 * Math.cos(markerAngle);

    marker.setAttribute("x1", x1.toString());
    marker.setAttribute("y1", y1.toString());
    marker.setAttribute("x2", x2.toString());
    marker.setAttribute("y2", y2.toString());
    marker.setAttribute("stroke", isDarkTheme ? "#718096" : "#4a5568");
    marker.setAttribute("stroke-width", "1");

    svg.appendChild(marker);
    svg.appendChild(number);
  }

  // Hands
  const hands = {
    hour: document.createElementNS("http://www.w3.org/2000/svg", "line"),
    minute: document.createElementNS("http://www.w3.org/2000/svg", "line"),
    second: document.createElementNS("http://www.w3.org/2000/svg", "line"),
  };

  Object.entries(hands).forEach(([type, hand]) => {
    hand.setAttribute("x1", "50");
    hand.setAttribute("y1", "50");
    hand.setAttribute("stroke-linecap", "round");
    hand.classList.add(`${type}-hand`);
    svg.appendChild(hand);
  });

  hands.hour.setAttribute("stroke-width", "3");
  hands.minute.setAttribute("stroke-width", "2");
  hands.second.setAttribute("stroke-width", "1");

  hands.hour.setAttribute("stroke", "#e2e8f0"); // Light hour hand
  hands.minute.setAttribute("stroke", "#a0aec0"); // Light minute hand
  hands.second.setAttribute("stroke", "#f56565"); // Red second hand

  return { svg, hands };
}

function updateAnalogClock(hands, date) {
  const hours = date.getHours() % 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  hands.hour.setAttribute(
    "x2",
    `${50 + 25 * Math.sin((hourAngle * Math.PI) / 180)}`
  );
  hands.hour.setAttribute(
    "y2",
    `${50 - 25 * Math.cos((hourAngle * Math.PI) / 180)}`
  );

  hands.minute.setAttribute(
    "x2",
    `${50 + 35 * Math.sin((minuteAngle * Math.PI) / 180)}`
  );
  hands.minute.setAttribute(
    "y2",
    `${50 - 35 * Math.cos((minuteAngle * Math.PI) / 180)}`
  );

  hands.second.setAttribute(
    "x2",
    `${50 + 40 * Math.sin((secondAngle * Math.PI) / 180)}`
  );
  hands.second.setAttribute(
    "y2",
    `${50 - 40 * Math.cos((secondAngle * Math.PI) / 180)}`
  );
}

function createClockElement(name, zone) {
  const clockCard = document.createElement("div");
  clockCard.className = "clock-card";

  const cityName = document.createElement("div");
  cityName.className = "city-name";
  cityName.textContent = name;

  const digitalTime = document.createElement("div");
  digitalTime.className = "time digital-time hidden";

  const date = document.createElement("div");
  date.className = "date";

  const analogClock = document.createElement("div");
  analogClock.className = "analog-clock active";
  const { svg, hands } = createAnalogClock();
  analogClock.appendChild(svg);

  clockCard.appendChild(cityName);
  clockCard.appendChild(digitalTime);
  clockCard.appendChild(analogClock);
  clockCard.appendChild(date);

  function updateTime() {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: zone })
    );
    digitalTime.textContent = formatTime(now, zone);
    date.textContent = formatDate(now, zone);
    updateAnalogClock(hands, now);
  }

  updateTime();
  setInterval(updateTime, 1000);

  return clockCard;
}

function toggleView() {
  isAnalog = !isAnalog;
  document.querySelectorAll(".analog-clock").forEach((clock) => {
    clock.classList.toggle("active");
  });
  document.querySelectorAll(".digital-time").forEach((time) => {
    time.classList.toggle("hidden");
  });

  const toggleText = document.getElementById("toggleText");
  const toggleIcon = document.getElementById("toggleIcon");
  toggleText.textContent = isAnalog ? "Switch to Digital" : "Switch to Analog";
  toggleIcon.textContent = isAnalog ? "🔢" : "🕐";
}

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  document.body.classList.toggle("light-theme");

  const themeText = document.getElementById("themeText");
  const themeIcon = document.getElementById("themeIcon");

  if (isDarkTheme) {
    themeText.textContent = "Light Mode";
    themeIcon.textContent = "🌙";
  } else {
    themeText.textContent = "Dark Mode";
    themeIcon.textContent = "☀️";
  }

  // Update analog clock colors based on theme
  document.querySelectorAll("svg").forEach((svg) => {
    const circle = svg.querySelector("circle");
    const numbers = svg.querySelectorAll("text");
    const markers = svg.querySelectorAll(
      "line:not(.hour-hand):not(.minute-hand):not(.second-hand)"
    );

    if (isDarkTheme) {
      circle.setAttribute("fill", "#1a202c");
      circle.setAttribute("stroke", "#4a5568");
      numbers.forEach((num) => num.setAttribute("fill", "#e2e8f0"));
      markers.forEach((marker) => marker.setAttribute("stroke", "#718096"));
    } else {
      circle.setAttribute("fill", "#ffffff");
      circle.setAttribute("stroke", "#e2e8f0");
      numbers.forEach((num) => num.setAttribute("fill", "#2d3748"));
      markers.forEach((marker) => marker.setAttribute("stroke", "#4a5568"));
    }
  });
}

function initializeClocks() {
  const container = document.getElementById("clockContainer");
  timeZones.forEach(({ name, zone }) => {
    const clockElement = createClockElement(name, zone);
    container.appendChild(clockElement);
  });

  const toggleText = document.getElementById("toggleText");
  const toggleIcon = document.getElementById("toggleIcon");
  toggleText.textContent = "Switch to Digital";
  toggleIcon.textContent = "🔢";

  document.getElementById("toggleView").addEventListener("click", toggleView);
  document.getElementById("toggleTheme").addEventListener("click", toggleTheme);
}

document.addEventListener("DOMContentLoaded", initializeClocks);
