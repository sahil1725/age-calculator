// Chronos Age Calculator - Precision Date Difference & Milestone Engine

const birthDateInput = document.getElementById('birthDateInput');
const calculateBtn = document.getElementById('calculateBtn');
const errorMessage = document.getElementById('errorMessage');

const resYears = document.getElementById('resYears');
const resMonths = document.getElementById('resMonths');
const resDays = document.getElementById('resDays');

const resDayOfWeek = document.getElementById('resDayOfWeek');
const resZodiac = document.getElementById('resZodiac');
const resNextBdayCountdown = document.getElementById('resNextBdayCountdown');

const resTotalDays = document.getElementById('resTotalDays');
const resTotalWeeks = document.getElementById('resTotalWeeks');
const resTotalHours = document.getElementById('resTotalHours');
const resTotalMinutes = document.getElementById('resTotalMinutes');

function init() {
  // Max date is today (cannot calculate future birth)
  const todayStr = new Date().toISOString().split('T')[0];
  birthDateInput.max = todayStr;

  // Set default sample date: 2003-08-15
  birthDateInput.value = '2003-08-15';
  calculateAge();

  calculateBtn.addEventListener('click', calculateAge);
  birthDateInput.addEventListener('change', calculateAge);
}

// Days in month helper (correctly accounts for leap years)
function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function calculateAge() {
  const dateVal = birthDateInput.value;
  if (!dateVal) {
    showError('Please select a valid date of birth.');
    return;
  }

  const birthDate = new Date(dateVal + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(birthDate.getTime())) {
    showError('Invalid date format.');
    return;
  }

  if (birthDate > today) {
    showError('Birth date cannot be in the future.');
    return;
  }

  clearError();

  let birthYear = birthDate.getFullYear();
  let birthMonth = birthDate.getMonth();
  let birthDay = birthDate.getDate();

  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth();
  let currentDay = today.getDate();

  let years = currentYear - birthYear;
  let months = currentMonth - birthMonth;
  let days = currentDay - birthDay;

  // Adjust for negative days by borrowing from the previous month
  if (days < 0) {
    // Borrow month
    months--;
    // Get total days in previous month
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    days += getDaysInMonth(prevYear, prevMonth);
  }

  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }

  // Render animated counters
  animateValue(resYears, parseInt(resYears.textContent) || 0, years, 500);
  animateValue(resMonths, parseInt(resMonths.textContent) || 0, months, 500);
  animateValue(resDays, parseInt(resDays.textContent) || 0, days, 500);

  // Day of week born
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  resDayOfWeek.textContent = daysOfWeek[birthDate.getDay()];

  // Zodiac Sign
  resZodiac.textContent = getZodiacSign(birthDay, birthMonth + 1);

  // Next Birthday Countdown
  calculateNextBirthday(birthDate, today);

  // Cumulative Lifetime Metrics
  calculateLifetimeMetrics(birthDate, today);
}

function calculateNextBirthday(birthDate, today) {
  const bMonth = birthDate.getMonth();
  const bDay = birthDate.getDate();

  let nextBday = new Date(today.getFullYear(), bMonth, bDay);
  if (nextBday < today) {
    nextBday.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = nextBday - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0 || diffDays === 365) {
    resNextBdayCountdown.textContent = '?? Today!';
  } else {
    resNextBdayCountdown.textContent = `In ${diffDays} days`;
  }
}

function calculateLifetimeMetrics(birthDate, today) {
  const diffMs = today.getTime() - birthDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  resTotalDays.textContent = totalDays.toLocaleString();
  resTotalWeeks.textContent = totalWeeks.toLocaleString();
  resTotalHours.textContent = totalHours.toLocaleString();
  resTotalMinutes.textContent = totalMinutes.toLocaleString();
}

function getZodiacSign(day, month) {
  const zodiac = [
    { sign: 'Capricorn ?', endDay: 19, month: 1 },
    { sign: 'Aquarius ?', endDay: 18, month: 2 },
    { sign: 'Pisces ?', endDay: 20, month: 3 },
    { sign: 'Aries ?', endDay: 19, month: 4 },
    { sign: 'Taurus ?', endDay: 20, month: 5 },
    { sign: 'Gemini ?', endDay: 20, month: 6 },
    { sign: 'Cancer ?', endDay: 22, month: 7 },
    { sign: 'Leo ?', endDay: 22, month: 8 },
    { sign: 'Virgo ?', endDay: 22, month: 9 },
    { sign: 'Libra ?', endDay: 22, month: 10 },
    { sign: 'Scorpio ?', endDay: 21, month: 11 },
    { sign: 'Sagittarius ?', endDay: 21, month: 12 },
    { sign: 'Capricorn ?', endDay: 31, month: 12 }
  ];

  const match = zodiac.find(z => month === z.month && day <= z.endDay);
  if (match) return match.sign;
  const nextMonth = month === 12 ? 1 : month + 1;
  const fallback = zodiac.find(z => z.month === nextMonth);
  return fallback ? fallback.sign : 'Aries ?';
}

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.add('visible');
}

function clearError() {
  errorMessage.textContent = '';
  errorMessage.classList.remove('visible');
}

document.addEventListener('DOMContentLoaded', init);
