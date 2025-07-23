const path = require('path');
require('dotenv').config({ debug: true }); // Ativa modo debug

console.log('Diretório atual:', process.cwd());
console.log('Arquivo .env carregado:', path.resolve('.env'));

console.log('\nVariáveis carregadas:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID || 'NÃO ENCONTRADO');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL || 'NÃO ENCONTRADO');
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'EXISTE' : 'NÃO ENCONTRADO');

// Pausa para visualização (remova depois)
setTimeout(() => {
  const admin = require('firebase-admin');
  
  if (!process.env.FIREBASE_PRIVATE_KEY) {
    console.error('\n❌ Variáveis não carregadas corretamente!');
    console.log('Verifique:');
    console.log('1. Se o arquivo .env está na pasta correta');
    console.log('2. Se o arquivo tem exatamente o nome ".env" (não ".env.txt")');
    console.log('3. Se as variáveis estão sem espaços antes/depois do =');
    process.exit(1);
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
    console.log('\n✅ Firebase inicializado com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro na inicialização:', error.message);
  }
}, 1000);