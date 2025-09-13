import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();

  const inputRadioValue = event.target.elements.state.value;
  const inputValueDelay = Number(event.target.elements.delay.value);

  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (inputRadioValue === 'fulfilled') {
        resolve(inputValueDelay);
      } else {
        reject(inputValueDelay);
      }
    }, inputValueDelay);
  })
    .then(value =>
      iziToast.success({
        title: 'OK',
        message: `✅ Fulfilled promise in ${value}ms`,
      })
    )
    .catch(error =>
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${error}ms`,
      })
    )
    event.target.reset();
}
