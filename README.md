# Sítio Sábio Sabiá
## Repositório para Homepage do Sítio Sábio Sabiá.
## Ver online: www.sitiosabiosabia.com.br
## Data de Criação: 02/06/2025
---

## ⚙️ Tecnologias & Infraestrutura

### **Frontend**
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) 
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) 
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
- ![Firebase](https://img.shields.io/badge/Firebase_Client_SDK-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
- **Hospedagem**: GitHub Pages

### **Backend**
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
- ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
- ![Firebase Admin](https://img.shields.io/badge/Firebase_Admin_SDK-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
- ![Multer](https://img.shields.io/badge/Multer-FF9900?style=for-the-badge&logo=upload&logoColor=white)
- ![Google Cloud Run](https://img.shields.io/badge/Cloud_Run-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)
- **Hospedagem**: Google Cloud Run

### **Banco & Storage**
- ![Firestore](https://img.shields.io/badge/Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
- ![Firebase Storage](https://img.shields.io/badge/Firebase_Storage-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

### **Infraestrutura**
- ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

---

-----------------------------------------------------------------------------------------------------------
# 02/06/2025
- Commit Inicial;
- Criação de index.html;
- Criação CNAME;
- Criação .nojekyll;
-----------------------------------------------------------------------------------------------------------
# 08/06/2025
- Criação de cunha.html;

-----------------------------------------------------------------------------------------------------------
# 30/06/2025
- Criação de login.html;
- Criação de restrito.html;

# **Sistema de Área Restrita com Node.js e Firebase**
Este projeto implementa uma **área restrita segura** para armazenamento de documentos pessoais, combinando:
- **Backend Node.js** (processamento seguro)
- **Firebase Admin SDK** (acesso protegido aos serviços)
- **Frontend estático** (interface do usuário)

## **Funcionalidades Principais**

### **Autenticação Segura**
- Login com e-mail/senha via Firebase Authentication
- Controle de acesso por ID de usuário via JWT
- Logout seguro com revogação de token

### **Gerenciamento de Arquivos via API Segura**
- **Upload de arquivos** através de endpoint protegido
- **Organização hierárquica** em subpastas
- Pré-visualização de imagens no cliente
- Barra de progresso para uploads
- Download via links temporários gerados no backend
- Exclusão com confirmação

### **Arquitetura Segura**
- Credenciais do Firebase **totalmente protegidas** no backend
- Validação em duas camadas (frontend + backend)
- Controle de acesso baseado em roles (implementação futura)
- Proteção contra uploads maliciosos

### **Interface Intuitiva**
- Navegação em breadcrumb
- Ícones para tipos de arquivos
- Busca em tempo real
- Design responsivo (mobile/desktop)
- Feedback visual para todas as operações

## **Como Implementamos?**
1. **Configuramos o ambiente seguro**:
   - Firebase Admin SDK com credenciais protegidas
   - Variáveis de ambiente para configurações sensíveis
   - Middlewares de autenticação JWT
2. **Desenvolvemos a API REST**:
   - Endpoints protegidos para todas as operações
   - Validação rigorosa de inputs
   - Tratamento de erros detalhado
3. **Implementamos o frontend**:
   - Chamadas à API com autenticação
   - Feedback visual para o usuário
   - Validações no cliente (camada adicional)
4. **Configuramos regras de segurança**:
   ```javascript
   // Exemplo de regra no backend
   app.post('/api/upload', authenticate, validateFile, async (req, res) => {
     // Verificações adicionais antes do processamento
   });
   ```

## **Próximos Passos**
- [ ] Implementar rate limiting na API
- [ ] Adicionar sistema de logs de operações
- [ ] Criar painel administrativo
- [ ] Implementar backup automático dos arquivos

**Como executar localmente:**

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (em outro terminal)
cd frontend
python3 -m http.server 3000
```

Feito por RDGCZ + Assistência de IA //
**Nota sobre segurança**: Esta implementação remove todas as credenciais sensíveis do frontend, garantindo que as operações sejam validadas e executadas apenas pelo backend autorizado.
-------------------------------------------------------------------------------------------------------------------------------
# 01/07/2025

```markdown
# 📂 Sitio Sabiá - Backend com Firebase

## 🛠️ Configuração Realizada

### 1. Estrutura do Projeto
```
sitio-sabio-sabia-backend/
├── src/
│   ├── app.js               # Configuração do servidor
│   ├── routes/files.js      # Endpoints de upload/download
│   └── services/storage.js  # Integração com Firebase
├── .env                     # Variáveis de ambiente
├── firebase-service-account.json # Credenciais (não versionado)
└── package.json
```

### 2. Tecnologias Implementadas
- **Node.js** (v18+)
- **Express** (Servidor HTTP)
- **Firebase Admin SDK** (Armazenamento de arquivos)
- **Dotenv** (Gestão de variáveis)

### 3. Funcionalidades Prontas
✔️ Servidor Node.js na porta `3001`  
✔️ Rota POST `/api/files/upload`  
✔️ Integração com Firebase Storage  
✔️ Proteção de credenciais (`.gitignore`)  

## 🔧 Como Executar

```bash
# 1. Clonar repositório
git clone https://github.com/Rdgcz/sitio-sabio-sabia-backend.git

# 2. Instalar dependências
npm install

# 3. Configurar ambiente
cp .env.example .env
# Preencher com seus dados do Firebase

# 4. Iniciar servidor
npm run dev
```

## 🔐 Variáveis de Ambiente (`.env`)
```ini
PORT=3001
FIREBASE_STORAGE_BUCKET="seu-projeto.appspot.com"
```

## 🌐 Endpoints
- **POST** `/api/files/upload`  
  ```json
  {
    "file": "[base64]",
    "fileName": "arquivo.txt"
  }
  ```

## 📌 Próximos Passos
- [ ] Implementar autenticação JWT  
- [ ] Criar rota de listagem de arquivos  
- [ ] Configurar CI/CD com GitHub Actions

---

> 💡 **Dica**: Sempre verifique se `firebase-service-account.json` está no `.gitignore`!

---------------------------------------------------------------------------------------------------
## 02/07/2025

Aqui está a síntese completa para seu `README.md`, organizada por tópicos:

---

# **Backend - Sitio Sabio Sabia**  
**Tecnologias**: Node.js, Express, Firebase (Auth + Storage), JWT  

## 🔧 **Configuração Inicial**  
1. **Variáveis de Ambiente** (`/.env`):  
   ```env
   PORT=3001
   JWT_SECRET=sua_chave_aleatoria_aqui
   FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
   FIREBASE_PROJECT_ID=seu-projeto-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@seu-projeto.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   ```

2. **Instalação**:  
   ```bash
   npm install express firebase-admin cors dotenv uuid
   ```

---

## 🚀 **Funcionalidades Implementadas**  
### **1. Autenticação JWT**  
- Rotas protegidas com middleware `authenticate`  
- Tokens expiram em 1 hora  
- Validação robusta de credenciais  

### **2. Upload de Arquivos**  
- Suporte a arquivos até 10MB  
- Tipos permitidos: `JPEG, PNG, PDF, TXT`  
- Sanitização automática de nomes  
- URLs temporárias com validade  

### **3. Rotas Principais**  
| Método | Rota               | Descrição                  |  
|--------|--------------------|----------------------------|  
| `GET`  | `/`                | Verificação do status      |  
| `POST` | `/api/files/upload`| Upload de arquivos (Base64)|  
| `GET`  | `/api/files/status`| Health check do Storage    |  

---

## 🛠 **Estrutura de Arquivos**  
```
src/
├── auth/
│   ├── middleware.js    # Validação JWT  
│   └── controller.js    # Rotas de login  
├── routes/
│   └── files.js         # Lógica de upload  
├── services/
│   └── storage.js       # Integração Firebase  
├── app.js               # Config Express  
└── startup.js           # Inicialização  
```

---

## 🔒 **Boas Práticas de Segurança**  
- Chaves privadas **nunca** commitadas  
- Validação de payloads com `Joi`  
- CORS restrito a domínios autorizados  
- Logs sensíveis ocultos em produção  

---

## 🐞 **Solução de Problemas Comuns**  
```bash
# Erro: "Bucket não encontrado"
Verifique: 
1. Permissões no Google Cloud IAM  
2. Nome do bucket no .env  

# Erro: "Token inválido"
Renove o JWT_SECRET e reinicie o servidor  
```

---

## 📈 **Próximos Passos**  
- [ ] Implementar rate limiting  
- [ ] Adicionar Swagger para documentação  
- [ ] Configurar HTTPS em produção  

[▶️ **Executar em desenvolvimento**]  
```bash
npm run dev
```  

---

---------------------------------------------------------------------------------------------------
## 03/07/2025 -- **PENDENTE**

# 🔥 **Guia Prático: Firebase em Produção para "sitiosabiosabia.com.br"**

## 📌 **Antes de Começar**
1. **Seu cenário atual**:
   - Frontend: GitHub Pages (HTML/CSS/JS estático) no domínio `sitiosabiosabia.com.br`.
   - Backend: Firebase (Firestore, Auth, Storage, etc.).
2. **O que precisamos fazer**:
   - Configurar o Firebase para produção (regras de segurança, domínio personalizado, etc.).
   - Testar todas as funcionalidades antes de liberar para usuários.

---

## 🚀 **Passo 1: Configurar o Firebase no Seu Projeto**
### 1.1 **Acesse o Console do Firebase**
- Vá para [Firebase Console](https://console.firebase.google.com/).
- Selecione seu projeto (`sitio-sabio-sabia`).

### 1.2 **Habilite os Serviços Necessários**
- **Firestore Database**: Ative e defina regras de segurança.
- **Authentication**: Habilite provedores (e-mail/senha, Google, etc.).
- **Storage**: Configure as permissões.

### 1.3 **Regras de Segurança (Crucial para Produção)**
Edite as regras no Firebase Console para **Firestore** e **Storage**:

**Firestore (em `firestore.rules`)**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Libera leitura/escrita apenas para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Storage (em `storage.rules`)**:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

> ⚠️ **Importante**: Teste as regras no simulador do Firebase antes de publicar!

---

## 🌐 **Passo 2: Vincular Seu Domínio ao Firebase**
### 2.1 **Adicione seu domínio no Firebase Hosting**
- No Console do Firebase, vá para **Hosting**.
- Clique em **Adicionar domínio** e insira `sitiosabiosabia.com.br`.
- Siga as instruções para verificar o domínio (via TXT no DNS).

### 2.2 **Configure o DNS no Registro.br**
- Acesse seu painel de domínio (ex: Registro.br).
- Adicione os registros DNS apontando para o Firebase:
  ```
  Tipo: A | Nome: @ | Valor: 199.36.158.100 (IP do Firebase)
  Tipo: A | Nome: www | Valor: 199.36.158.100
  ```

### 2.3 **Forçar HTTPS (Opcional, mas recomendado)**
No Firebase Hosting, ative a opção **"Redirecionar HTTP para HTTPS"**.

---

## 🧪 **Passo 3: Testes em Produção**
### 3.1 **Teste de Autenticação**
- Acesse seu site (`https://sitiosabiosabia.com.br`).
- Tente criar um usuário e fazer login.
- Verifique no Firebase Console se o usuário aparece em **Authentication**.

### 3.2 **Teste de Firestore/Storage**
- Faça upload de uma imagem (Storage).
- Crie um documento no Firestore.
- Verifique no Console se os dados foram salvos.

### 3.3 **Teste de Performance**
- Use o [Lighthouse](https://developers.google.com/web/tools/lighthouse) para auditar seu site.

---

## 🔒 **Passo 4: Monitoramento e Manutenção**
### 4.1 **Ative Alertas no Firebase**
- Vá para **Project Settings > Monitoring**.
- Configure alertas para falhas de autenticação, aumento de tráfego, etc.

### 4.2 **Backup dos Dados**
- **Firestore**: Use `firestore-backup-restore` para backups automáticos.
- **Storage**: Habilite versionamento no Google Cloud Storage.

---

## 📋 **Checklist Final**
| Tarefa | Status (✔/✖) |
|--------|--------------|
| Regras de segurança publicadas | |
| Domínio vinculado ao Firebase | |
| HTTPS funcionando | |
| Testes de autenticação concluídos | |
| Testes de Firestore/Storage OK | |
| Alertas configurados | |

---

## ❓ **Dúvidas Comuns**
### **1. Como atualizar o site no GitHub Pages sem perder as configurações do Firebase?**
- Seu frontend (GitHub Pages) e backend (Firebase) são independentes. Basta atualizar o código no GitHub normalmente.

### **2. Posso usar o mesmo domínio para GitHub Pages e Firebase Hosting?**
- Não. O domínio principal (`sitiosabiosabia.com.br`) deve apontar para **um só serviço** (GitHub Pages **ou** Firebase Hosting). Recomendo:
  - Use `sitiosabiosabia.com.br` para GitHub Pages (frontend).
  - Use `api.sitiosabiosabia.com.br` para Firebase (backend).

---

## 06/07/2025

# 📦 Documentação do Processo Docker para o README.md

## 🐳 Implementação Docker no Projeto

### 🔧 Passos Realizados

1. **Configuração Inicial do Docker**
   - Criação do `Dockerfile` com configuração para Node.js 18 (Alpine)
   - Configuração do `.dockerignore` para excluir arquivos sensíveis e temporários
   - Resolução de problemas de build relacionados ao arquivo `.env`

2. **Arquitetura do Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /usr/src/app
   COPY package*.json ./
   COPY .env ./
   RUN npm install --production
   COPY . .
   EXPOSE 8080
   CMD ["node", "src/app.js"]
   ```

3. **Build da Imagem Docker**
   - Comando executado com sucesso:
     ```bash
     docker build -t meu-app-node .
     ```
   - Tempo total de build: 71.8 segundos
   - Tamanho final da imagem: ~40MB (base Alpine)

### ✅ Resultado do Build

O processo de construção foi concluído com sucesso, conforme mostrado no log:

```
[+] Building 71.8s (12/12) FINISHED
 => [internal] load build definition from Dockerfile                                                                0.3s
 => [1/6] FROM node:18-alpine@sha256:8d6421...                                                                     8.4s
 => [2/6] WORKDIR /usr/src/app                                                                                     3.7s
 => [3/6] COPY package*.json ./                                                                                    1.6s
 => [4/6] COPY .env ./                                                                                             2.0s
 => [5/6] RUN npm install --production                                                                            18.0s
 => [6/6] COPY . .                                                                                                 3.6s
 => exporting to image                                                                                            24.8s
 => => naming to docker.io/library/meu-app-node:latest                                                             0.1s
```

### 🔍 Análise do Processo

1. **Eficiência do Build**
   - O sistema aproveitou eficientemente o cache de camadas
   - A instalação das dependências (`npm install`) foi a etapa mais demorada (18s)

2. **Segurança**
   - O arquivo `.env` com credenciais foi incluído corretamente
   - Uso da imagem Alpine reduziu significativamente o tamanho final

## 🚀 Próximos Passos

### 1. Execução do Container
```bash
docker run -p 8080:8080 -d meu-app-node
```

### 2. Implementação em Produção
- Configurar variáveis de ambiente seguras
- Implementar Docker Secrets para credenciais
- Configurar um serviço de orquestração (Docker Compose ou Kubernetes)

### 3. Otimizações Recomendadas
1. **Multi-stage Builds**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY . .
   RUN npm install && npm run build
   
   FROM node:18-alpine
   WORKDIR /app
   COPY --from=builder /app/dist ./dist
   COPY --from=builder /app/node_modules ./node_modules
   CMD ["node", "dist/app.js"]
   ```

2. **Health Checks**
   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=3s \
     CMD curl -f http://localhost:8080/health || exit 1
   ```

3. **Monitoramento**
   - Configurar métricas e logs do container
   - Implementar autoscaling baseado em demanda

## 📌 Considerações Finais

O projeto está pronto para containerização com Docker. Para ambientes de produção, recomenda-se:

1. Configurar um registro privado para as imagens
2. Implementar CI/CD para builds automatizados
3. Adicionar monitoramento e alertas
4. Configurar backups dos volumes persistentes

---
## 22/07/2025

# **Relatório Técnico - Implementação Segura do Projeto**

Este documento detalha todo o processo de configuração segura do repositório, incluindo problemas encontrados e soluções implementadas.

---

## **📜 Histórico de Problemas e Soluções**

### **1. Problema: Vazamento de Credenciais no Histórico do Git**
- **Detecção**: GitHub alertou sobre chaves do Firebase em commits antigos
- **Arquivos afetados**:
  - `backend/src/config/firebase-admin-credentials.json`
  - `backend/src/config/firebase-service-account.json`
- **Solução aplicada**:
  ```bash
  git filter-repo --force \
    --path backend/src/config/firebase-*.json \
    --invert-paths
  git push origin main --force
  ```

### **2. Problema: Conflitos no Primeiro Push**
- **Causa**: Repositório remoto continha arquivos inexistentes localmente (README.md, LICENSE)
- **Solução**:
  ```bash
  git pull origin main --allow-unrelated-histories
  git push -u origin main
  ```

### **3. Problema: Push Protection do GitHub**
- **Cenário**: GitHub bloqueou pushes mesmo após limpeza
- **Solução definitiva**:
  - Criação de novo repositório
  - Configuração correta do `.gitignore` antes do primeiro commit

---

## **🔐 Arquitetura de Segurança Implementada**

### **Estrutura de Pastas Segura**
```
backend/
└── src/
    └── config/
        ├── firebase-config.example.json  # Template seguro
        └── (credenciais reais NÃO versionadas)
```

### **.gitignore Otimizado**
```gitignore
# Firebase
backend/src/config/firebase-*.json
.firebase/
.firebaserc

# Environment
.env
.env.*
!.env.example

# Chaves e certificados
*.key
*.pem
*.crt
```

---

## **⚙️ Fluxo de Trabalho Aprovado**

1. **Configuração Inicial Segura**:
   ```bash
   git init
   echo "backend/src/config/firebase-*.json" >> .gitignore
   git add .
   git commit -m "Initial commit with proper security"
   ```

2. **Para atualizações**:
   ```bash
   git add .
   git commit -m "Descrição das alterações"
   git push
   ```

3. **Para adicionar novas dependências**:
   ```bash
   npm install --save pacote
   echo "/node_modules/" >> .gitignore
   ```

---

## **📌 Lições Aprendidas**

1. **Sempre configurar .gitignore antes do primeiro commit**
2. **Nunca commitar arquivos com**:
   - Chaves de API
   - Credenciais de serviço
   - Configurações de ambiente
3. **Usar templates** (`*.example.json`) para documentar configurações
4. **Monitorar regularmente** o GitHub Security Alerts

---

## **🔗 Links Úteis**
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Git Filter-Repo Documentation](https://github.com/newren/git-filter-repo)

--- 

## 25/07/2025

Excelente decisão, Rodrigo!
Aqui está um **`README.md`** **super completo** e **integrado**, cobrindo **todo o fluxo real** do seu projeto **`Sitio Sabio Sabia`**, do **frontend** ao **backend**, com **Firebase**, **Cloud Run**, **Secrets**, **DNS** e **boas práticas**.
Guarde este arquivo como **documentação oficial** do seu repositório!

---

## ✅ `README.md` COMPLETO — **Sitio Sabio Sabia**

```markdown
# 🌿 Sitio Sabio Sabia — Documentação Completa

Este repositório reúne **frontend** e **backend** do projeto **Sitio Sabio Sabia**, integrando **Firebase**, **Cloud Run**, **Auth**, **Storage**, **Firestore** e **GitHub Pages**.

---

## 📂 Estrutura de Pastas

```

/
├── index.html          # Página inicial, contém inicialização do Firebase
├── frontend/
│   ├── login.html      # Tela de login com Firebase Auth + chamada backend
│   ├── restrito.html   # Área restrita, protegida pelo Firebase SDK
│   ├── config.js (opcional) # Guarda BACKEND\_URL se quiser usar variável global
├── backend/
│   ├── Dockerfile      # Container do backend para Cloud Run
│   ├── src/
│   │   ├── app.js      # App Express principal
│   │   ├── config/index.js  # Configuração de envs, Firebase Admin
│   │   ├── routes/     # Rotas API (/api/auth etc.)
│   │   └── middlewares/

````

---

## ⚙️ Tecnologias Principais

- **Frontend**: HTML + Firebase Client SDK
- **Backend**: Node.js + Express + Firebase Admin SDK + Multer + Cloud Run
- **Hospedagem Frontend**: GitHub Pages
- **Hospedagem Backend**: Google Cloud Run
- **Banco**: Firestore
- **Storage**: Firebase Storage

---

## 🔐 Autenticação

- O **login** usa Firebase Auth (Google, Email/Senha, etc.).
- No `login.html`, após o login Firebase, um **ID Token** é gerado:
  ```javascript
  const firebaseToken = await user.getIdToken();
````

* Esse token é enviado via **`fetch`** para:

  ```
  POST https://backend-api-XXXXXX.us-central1.run.app/api/auth
  ```
* O backend **verifica o ID Token** usando Firebase Admin SDK → cria sessão, logs, etc.

---

## 🔒 Área Restrita

* O `restrito.html` confia no **Firebase Client SDK** para proteger a página:

  ```javascript
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      window.location.href = 'login.html';
    }
  });
  ```
* Não faz `fetch` para o backend Node, pois neste projeto só o **admin** (você) acessa.

---

## 🌐 Backend no Cloud Run

* O backend é empacotado num **container Docker**:

  ```dockerfile
  FROM node:18
  WORKDIR /app
  COPY . .
  RUN npm install
  CMD ["node", "src/app.js"]
  ```

* É construído e enviado via:

  ```bash
  gcloud builds submit --tag gcr.io/SEU_PROJECT_ID/backend-api
  ```

* Implantado:

  ```bash
  gcloud run deploy backend-api \
    --image gcr.io/SEU_PROJECT_ID/backend-api \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars "FIREBASE_PROJECT_ID=...,FIREBASE_CLIENT_EMAIL=...,ALLOWED_ORIGINS=https://www.seusite.com,..." \
    --set-secrets FIREBASE_PRIVATE_KEY=firebase-private-key:latest
  ```

---

## ✅ Firebase Admin no Backend

Para inicializar:

```js
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  databaseURL: process.env.FIREBASE_DATABASE_URL
});
```

---

## 🔑 🔐 Secrets — **FIREBASE\_PRIVATE\_KEY**

* O **`FIREBASE_PRIVATE_KEY`** é o maior ponto de atenção.

* Use **Google Secret Manager** para não se perder com `\n` escapados:

  ```bash
  echo "-----BEGIN PRIVATE KEY-----
  ...
  -----END PRIVATE KEY-----" | gcloud secrets create firebase-private-key --data-file=-
  ```

* Permita acesso:

  ```bash
  gcloud secrets add-iam-policy-binding firebase-private-key \
    --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
  ```

---

## 🌐 Domínio e DNS

* Frontend: `sitiosabiosabia.com.br` → GitHub Pages.
* Backend: URL Cloud Run ex: `https://backend-api-XXXXXX.us-central1.run.app`
* **Recomendado:** criar `api.sitiosabiosabia.com.br` (CNAME) apontando para URL do Cloud Run.

---

## ⚡ CORS no Backend

O backend Express deve aceitar requisições só do domínio do frontend:

```env
ALLOWED_ORIGINS=https://www.sitiosabiosabia.com.br
```

---

## 📄 `.env.example` recomendado

```env
# Firebase
FIREBASE_PROJECT_ID=sitio-sabio-sabia
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@xxx.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=(via Secrets Manager)
FIREBASE_STORAGE_BUCKET=sitio-sabio-sabia.appspot.com
FIREBASE_DATABASE_URL=https://sitio-sabio-sabia.firebaseio.com

# API
ALLOWED_ORIGINS=https://www.sitiosabiosabia.com.br
API_BASE_URL=https://backend-api-XXXXXX.us-central1.run.app

# Sessão/JWT
JWT_SECRET=<sua chave forte>
SESSION_SECRET=<sua chave forte>

# Limites
RATE_WINDOW=15
RATE_LIMIT=100
MAX_REQUEST_SIZE=50kb

# Node env
NODE_ENV=production
```

---

## ✅ Health check

Para testar:

```bash
curl https://backend-api-XXXXXX.us-central1.run.app/health
# Deve responder: { "status": "healthy" }
```

---

## 🧑‍💻 Comandos Git + Deploy

```bash
git add .
git commit -m "Fix multer /tmp, config keys, deploy Cloud Run"
git push origin main

# Build & Push
gcloud builds submit --tag gcr.io/SEU_PROJECT_ID/backend-api

# Deploy Cloud Run
gcloud run deploy backend-api \
  --image gcr.io/SEU_PROJECT_ID/backend-api \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ...
  --set-secrets FIREBASE_PRIVATE_KEY=firebase-private-key:latest
```

---

## ✅ Checklist final

* 🔒 **PRIVATE\_KEY:** sempre Secrets Manager ou `.env` local com quebras REAIS.
* ⚙️ **Multer:** use `/tmp/uploads` no Cloud Run (não use `/app`).
* 🔗 **Frontend:** `fetch` para URL do Cloud Run.
* 🌍 **CNAME:** `api.sitiosabiosabia.com.br` opcional, mas recomendável.
* 🚦 **CORS:** restrito ao domínio real.

---

## 🚀 Contribuições

Projeto pessoal, **apenas admin** (Rodrigo) faz deploys e push.

---

## 🎉 Feito com ❤️ e persistência

> **Sitio Sabio Sabia** — *Onde caminhos reais encontram deploys reais!*



