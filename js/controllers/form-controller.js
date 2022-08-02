import Address from '../models/address.js';
import * as addressService from '../services/address-service.js';
import * as listController from './list-controller.js';

function State() {
  this.address = new Address();

  this.btnSave = null;
  this.btnClear = null;

  this.inputCep = null;
  this.inputStreet = null;
  this.inputNumber = null;
  this.inputCity = null;

  this.errorCep = null;
  this.errorNumber = null;
}
const state = new State();

export function init() {
  state.inputCep = document.forms.newAddress.cep;
  state.inputStreet = document.forms.newAddress.street;
  state.inputNumber = document.forms.newAddress.number;
  state.inputCity = document.forms.newAddress.city;

  state.btnSave = document.forms.newAddress.btnSave;
  state.btnClear = document.forms.newAddress.btnClear;

  state.errorCep = document.querySelector('[data-error="cep"]');
  state.errorNumber = document.querySelector('[data-error="number"]');
  
  state.inputNumber.addEventListener('change', handleInputNumberChange);
  state.inputNumber.addEventListener('keyup', handleInputNumberKeyup);
  state.btnClear.addEventListener('click',handleBtnClearClick);
  state.btnSave.addEventListener('click',handleBtnSaveClick);

  state.inputCep.addEventListener('change', handleInputCepChange);
  
}

function handleInputNumberKeyup(event){
  state.address.number = event.target.value;
}

 async function handleInputCepChange(event){
  const cep = event.target.value;
 try{
  const address = await addressService.findByCep(cep);

  state.inputStreet.value = address.street;
  state.inputCity.value = address.city;
  state.address = address;
 
  setFormError("cep", "");
  state.inputNumber.focus();

}
catch(e){
  state.inputStreet.value = "";
  state.inputCity.value = "";
 setFormError("cep","Informe um CEP válido");
}


 }

// Função que apresenta o errode Campo requerido
function handleInputNumberChange(event){
  if (event.target.value == ""){
    setFormError("number","Campo requerido");
    }
    else{
      setFormError("number", "");
    }
}

async function handleBtnSaveClick(event){
  event.preventDefault();

  const errors = addressService.getErrors(state.address);

  const keys = Object.keys(errors);

  if(keys.length > 0){
    for(let i =0; i < keys.length; i++){
      setFormError(keys[i],errors[keys[i]]);
    }
  }
  else{
    listController.addcard(state.address);
    clearForm();
  }
}

//Função para limpar os dados do campo e direcionar o cursor para o primeiro campo
function handleBtnClearClick(event){
event.preventDefault();
clearForm();
}

function clearForm(){
  state.inputCep.value = "";
  state.inputCity.value = "";
  state.inputNumber.value = "";
  state.inputStreet.value = "";

  state.address = new Address();

  setFormError("cep","");
  setFormError("number","");

  state.inputCep.focus();
}

//Apresenta o somente se digirar uma informação e apagar
function setFormError(key, value){
  const element = document.querySelector(`[data-error="${key}"]`);
  element.innerHTML = value;
}
