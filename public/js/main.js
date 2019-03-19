const plantForm = document.querySelector('#plantForm')
const statePlant = document.querySelector('#statePlant')
const statePlantFeedback = document.querySelector('#statePlant-feedback')
const workerID = document.querySelector('#workerID')
const workerIDFeedback = document.querySelector('#workerID-feedback')

if (plantForm) {
  plantForm.addEventListener('submit', (e) => {
    if (statePlant.value === '' || statePlant.value > 5 || statePlant.value <= 0) {
      e.preventDefault()
      statePlantFeedback.textContent = 'Please select a valid plant state'
    } else {
      statePlantFeedback.textContent = ''
    }

    if (workerID.value === '') {
      e.preventDefault()
      workerIDFeedback.textContent = 'Please enter a worker ID'
    } else if (isNaN(parseInt(workerID.value))) {
      e.preventDefault()
      workerIDFeedback.textContent = 'Please enter a number as worker ID'
    } else if (workerID.value.toString().length !== 8) {
      e.preventDefault()
      workerIDFeedback.textContent = 'Please enter a valid worker ID of 8-digits'
    } else {
      workerIDFeedback.textContent = ''
    }
  })
}
