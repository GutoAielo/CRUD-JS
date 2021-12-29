'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')
const openModal2 = () =>
  document.getElementById('modal2').classList.add('active')

const closeModal2 = () => {
  document.getElementById('modal2').classList.remove('active')
}

const closeModal = () => {
  clearFields()
  document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem('db_student')) ?? []
const setLocalStorage = dbStudent =>
  localStorage.setItem('db_student', JSON.stringify(dbStudent))

// CRUD
const deleteStudent = index => {
  const dbStudent = readStudent()
  dbStudent.splice(index, 1)
  setLocalStorage(dbStudent)
}

const updateStudent = (index, student) => {
  const dbStudent = readStudent()
  dbStudent[index] = student
  setLocalStorage(dbStudent)
}

const readStudent = () => getLocalStorage()

const createStudent = student => {
  const dbStudent = getLocalStorage()
  dbStudent.push(student)
  setLocalStorage(dbStudent)
}
// Validação
const isValidFields = () => {
  return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
  const fields = document.querySelectorAll('.modal-field')
  fields.forEach(field => (field.value = ''))
  document.getElementById('nome').dataset.index = 'new'
}

const saveStudent = () => {
  debugger
  if (isValidFields()) {
    const student = {
      nome: document.getElementById('nome').value,
      celular: document.getElementById('celular').value,
      nascimento: document.getElementById('date').value,
      nota: document.getElementById('nota').value
    }
    const index = document.getElementById('nome').dataset.index
    if (index == 'new') {
      createStudent(student)
      updateTable()
      closeModal()
    } else {
      updateStudent(index, student)
      updateTable()
      closeModal()
    }
  }
}
// ROWs
const createRow = (student, index) => {
  function formatData(date) {
    let data = new Date(date)
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(data)
  }
  const newRow = document.createElement('tr')
  newRow.innerHTML = `
        <td>${student.nome}</td>
        <td>${student.celular}</td>
        <td>${formatData(student.nascimento)}</td>
        <td>${student.nota}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
  document.querySelector('#tableStudent>tbody').appendChild(newRow)
}

const clearTable = () => {
  const rows = document.querySelectorAll('#tableStudent>tbody tr')
  rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
  const dbStudent = readStudent()
  clearTable()
  dbStudent.forEach(createRow)
}

const fillFields = student => {
  document.getElementById('nome').value = student.nome
  document.getElementById('celular').value = student.celular
  document.getElementById('date').value = student.nascimento
  document.getElementById('nota').value = student.nota
  document.getElementById('nome').dataset.index = student.index
}

const editStudent = index => {
  const student = readStudent()[index]
  student.index = index
  fillFields(student)
  openModal()
}

const editDelete = event => {
  if (event.target.type == 'button') {
    const [action, index] = event.target.id.split('-')

    if (action == 'edit') {
      editStudent(index)
    } else {
      const student = readStudent()[index]
      let avisoDelete = document.querySelector('#avisoDelete')

      avisoDelete.textContent = `Deseja realmente excluir o Aluno ${student.nome}?`
      openModal2()

      // APAGAR O REGISTRO
      document.getElementById('apagar').addEventListener('click', () => {
        deleteStudent(index)
        updateTable()
        closeModal2()
      })
    }
  }
}

updateTable()

// Listeners
document.getElementById('cadastrarAluno').addEventListener('click', openModal)

document.getElementById('modalClose').addEventListener('click', closeModal)

// modal apagar
document.getElementById('modalClose2').addEventListener('click', closeModal2)

document.getElementById('salvar').addEventListener('click', saveStudent)

document
  .querySelector('#tableStudent>tbody')
  .addEventListener('click', editDelete)

document.getElementById('cancelar').addEventListener('click', closeModal)

// modal apagar
document.getElementById('cancelar2').addEventListener('click', closeModal2)
