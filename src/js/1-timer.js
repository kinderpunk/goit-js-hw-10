('use strict');

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import error from '../img/octagon.svg';

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    userSelectedDate = selectedDate;

    if (selectedDate <= new Date()) {
      refs.startBtn.disabled = true;

      iziToast.show({
        theme: 'dark',
        message: 'Please choose a date in the future',
        messageColor: '#ffffff',
        backgroundColor: '#ef4040',
        position: 'topRight',
        iconUrl: error,
        progressBarColor: '#b51b1b',
        pauseOnHover: true,
        closeColor: '#ffffff',
        timeout: 3000,
      });
    } else {
      refs.startBtn.disabled = false;
    }

    timer.setTargetTime(selectedDate);
  },
};

flatpickr('#datetime-picker', options);
let userSelectedDate = new Date();

const refs = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
  startBtn: document.querySelector('[data-start]'),
  input: document.querySelector('#datetime-picker'),
};

class Timer {
  constructor({ onTick }) {
    this.isActive = false;
    this.onTick = onTick;
    this.startTime = null;
    this.targetTime = 0;
  }

  start() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    refs.startBtn.disabled = true;
    refs.input.disabled = true;

    this.timerInterval = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = this.targetTime - currentTime + 1000;
      const time = this.convertMs(deltaTime);

      if (deltaTime <= 0) {
        this.stop();
        return;
      }

      this.onTick(time);
    }, 1000);
  }

  stop() {
    clearInterval(this.timerInterval);
    this.isActive = false;
    refs.startBtn.disabled = false;
    refs.input.disabled = false;
  }

  setTargetTime(selectedDate) {
    userSelectedDate = selectedDate;
    this.targetTime = selectedDate.getTime();
  }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = this.addLeadingZero(Math.floor(ms / day));
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }
}

const timer = new Timer({
  onTick: updateTime,
});

refs.startBtn.addEventListener('click', () => {
  if (userSelectedDate && userSelectedDate > new Date()) {
    timer.start();
  }
});

function updateTime({ days, hours, minutes, seconds }) {
  refs.days.textContent = `${days}`;
  refs.hours.textContent = `${hours}`;
  refs.minutes.textContent = `${minutes}`;
  refs.seconds.textContent = `${seconds}`;

  return { days, hours, minutes, seconds };
}
