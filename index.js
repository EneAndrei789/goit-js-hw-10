// cat-api.js
// obținerea rasei
import axios from 'axios';

axios.defaults.headers.common["x-api-key"] = "live_pCrgM4Y5cDkP2GyZ3UcbDdqiIeXFxXEpi5KbubNPWCALY0X6MNhTpauLUPmqzBf8";

export const fetchBreeds = async () => {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch breeds');
  }
};

// pentru obținerea informațiilor detaliate despre pisică
export const fetchCatByBreed = async (breedId) => {
    try {
      const response = await axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`);
      return response.data[0]; // Returnează primul rezultat
    } catch (error) {
      throw new Error('Failed to fetch cat data');
    }
  };

  // index.js
//   interfeța utilizator
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

// selectare elemente din DOM
const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

// Funcție pentru a gestiona erorile
const showError = () => {
  error.style.display = 'block';
  loader.style.display = 'none';
};

// Funcție pentru a ascunde eroarea
const hideError = () => {
  error.style.display = 'none';
};

// Funcție pentru a ascunde loader-ul
const hideLoader = () => {
  loader.style.display = 'none';
};

// Funcție pentru a arăta loader-ul
const showLoader = () => {
  loader.style.display = 'block';
};

// Populăm selectorul de rase
const populateBreedSelect = (breeds) => {
  breedSelect.innerHTML = '<option value="">Select breed</option>'; // Resetăm opțiunile
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
};

// Funcție pentru a obține și a afișa rasele
const getBreeds = async () => {
  try {
    showLoader();
    hideError();
    const breeds = await fetchBreeds();
    populateBreedSelect(breeds);
    hideLoader();
  } catch (error) {
    showError();
  }
};

// Funcție pentru a obține informațiile detaliate despre pisică
const getCatInfo = async (breedId) => {
  try {
    showLoader();
    const catData = await fetchCatByBreed(breedId);
    catInfo.innerHTML = `
      <h2>${catData.breeds[0].name}</h2>
      <p>${catData.breeds[0].description}</p>
      <p><strong>Temperament:</strong> ${catData.breeds[0].temperament}</p>
      <img src="${catData.url}" alt="${catData.breeds[0].name}" width="300">
    `;
    hideLoader();
  } catch (error) {
    showError();
  }
};

// Eveniment pentru schimbarea selecției rasei
breedSelect.addEventListener('change', (event) => {
  const breedId = event.target.value;
  if (breedId) {
    getCatInfo(breedId);
  } else {
    catInfo.innerHTML = '';
  }
});

// Încarcăm rasele când se încarcă pagina
window.addEventListener('load', getBreeds);

  
