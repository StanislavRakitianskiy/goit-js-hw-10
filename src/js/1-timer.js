import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  dataDays: document.querySelector('[data-days]'),
  dataHours: document.querySelector('[data-hours]'),
  dataMinutes: document.querySelector('[data-minutes]'),
  dataSeconds: document.querySelector('[data-seconds]'),
  startBtn: document.querySelector('[data-start]'),
  dateInput: document.querySelector('#datetime-picker'),
};
let userSelectedDate = null;
refs.startBtn.disabled = true;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const now = new Date();
    const diff = selectedDate - now;
    if (diff <= 0) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      refs.startBtn.disabled = true;
      userSelectedDate = null;
    } else {
      userSelectedDate = selectedDate;
      refs.startBtn.disabled = false;
    }
  },
};
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateClockface({ days, hours, minutes, seconds }) {
  refs.dataDays.textContent = addLeadingZero(days);
  refs.dataHours.textContent = addLeadingZero(hours);
  refs.dataMinutes.textContent = addLeadingZero(minutes);
  refs.dataSeconds.textContent = addLeadingZero(seconds);
}

updateClockface({ days: 0, hours: 0, minutes: 0, seconds: 0 });

refs.startBtn.addEventListener('click', onStart);
function onStart() {
  if (!userSelectedDate) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
    });
    return;
  }
  refs.dateInput.disabled = true;
  refs.startBtn.disabled = true;

  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  const diff = userSelectedDate - new Date();

  if (diff <= 0) {
    updateClockface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    refs.dateInput.disabled = false;
    refs.startBtn.disabled = true;
    return;
  }

  updateClockface(convertMs(diff));
  timerId = setInterval(() => {
    const diff = userSelectedDate - new Date();
    if (diff <= 0) {
      clearInterval(timerId);
      timerId = null;
      updateClockface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      refs.dateInput.disabled = false;
      refs.startBtn.disabled = true;
      return;
    }
    updateClockface(convertMs(diff));
  }, 1000);
}

flatpickr('#datetime-picker', options);
