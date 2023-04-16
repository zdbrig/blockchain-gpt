import axios from 'axios';

export async function executeCommand(input:any) {
  return new Promise((resolve, reject) => {
    axios.post('http://blockchain_gpt:3040/api/execute-command', {
      command: input
    }, {
      headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(error => {
      reject(error);
    });
  });
}




