import React, { useState } from 'react';

function App() {
  const [userId, setUserId] = useState('');
  const [qrCode, setQrCode] = useState('');

  const createSession = () => {
    // Substitua pela URL do seu servidor
    const serverUrl = 'http://localhost:3000';

    // Faça uma requisição POST para criar uma sessão
    fetch(`${serverUrl}/create-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })
      .then((response) => response.text())
      .then((html) => {
        document.body.innerHTML = html;
      })
      .catch((error) => {
        console.error('Erro ao criar a sessão:', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createSession();
  };

  return (
    <div id="app">
      <h1>Autenticação WhatsApp Web</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Insira seu UserID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>
        <button type="submit">Gerar Sessão</button>
      </form>
      <p>Usuário: {userId}</p>
      {qrCode && <img src={qrCode} alt="Código QR" />}
    </div>
  );
}

export default App;
