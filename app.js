const axios = require('axios');
const sha1 = require('sha1');
const fs = require('fs');

require('dotenv/config');

const api = axios.create({
  baseURL: 'https://api.codenation.dev/v1/challenge/dev-ps'
});

const getChallengeData = async () => {
  try {
    return await api.get(`/generate-data?token=${process.env.CODENATION_TOKEN}`);
  } catch (error) {
    console.error(error);
  }
}

const mod = (number, mod) => {
  return ((number % mod) + mod) % mod;
}

const decryptCaesar = (shift, encrypted, alphabet) => {
  return encrypted.split('')
                  .map(letter => (alphabet.indexOf(letter) > -1) ? alphabet[mod(alphabet.indexOf(letter) - shift, alphabet.length)] : letter)
                  .join('');
}

const saveToDisk = answer => {
  fs.writeFile('answer.json', JSON.stringify(answer), error => {
    if (error) return console.error(error);
  });
}

const start = async () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const { data: challengeData } = await getChallengeData();

  if (challengeData) {
    let answer = {...challengeData};
    answer.decifrado = decryptCaesar(answer.numero_casas, answer.cifrado, alphabet);
    answer.resumo_criptografico = sha1(answer.decifrado);
    saveToDisk(answer);
  } else {
    console.error("Whoops! Something went wrong.");
  }
}

start();
