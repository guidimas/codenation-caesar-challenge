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

const start = async () => {
  const { data: challengeData } = await getChallengeData();

  if (challengeData) {
    const { numero_casas: shift, cifrado: encrypted } = challengeData;
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const decrypted = decryptCaesar(shift, encrypted, alphabet);

    const final = challengeData;
    final.decifrado = decrypted;
    final.resumo_criptografico = sha1(decrypted);

    console.log(final);

    fs.writeFileSync('answer.json', JSON.stringify(final), error => {
      console.error(error);
    });
  } else {
    console.error("Whoops! Something went wrong.");
  }
}

start();
