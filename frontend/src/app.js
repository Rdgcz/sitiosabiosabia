import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Configs do ambiente
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
};

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Inicializa Firebase
  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  // Busca dados do backend
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users`);
      setUsers(await res.json());
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  return (
    <div>
      <h1>Sítio Sábia Sabiá</h1>
      {user ? (
        <div>
          <button onClick={fetchUsers}>Carregar Usuários</button>
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Faça login para continuar</p>
      )}
    </div>
  );
}

export default App;