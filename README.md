# 📊 Dashboard de Criptomoedas

Este é um projeto de dashboard de criptomoedas desenvolvido com **Next.js**, **React**, **Tailwind CSS** e **Framer Motion**. O projeto consome uma API Node.js com dados da [CoinGecko API](https://www.coingecko.com/en/api), apresentando as principais informações das moedas em tempo real com um layout responsivo, dark mode e animações modernas.

---

## 🚀 Funcionalidades

- Listagem das principais criptomoedas
- Exibição de preço atual e variação nas últimas 24h
- Design responsivo com **modo claro e escuro**
- Animações suaves com **Framer Motion**

---

## 🖼️ Interface

Adicionar imagens da interface do projeto. 

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Axios](https://axios-http.com/)
- [TypeScript](https://www.typescriptlang.org/)

### Backend
- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [CoinGecko API](https://www.coingecko.com/en/api)
- [Node.js](https://nodejs.org/en)


---

## ⚙️ Como rodar o projeto

### 🔧 Backend

```bash
cd backend
npm install
node server.js
```

O servidor será iniciado em: `http://localhost:5001`

### 💻 Frontend

```bash
cd frontend
npm install
npm run dev
```

O aplicativo será executado em: `http://localhost:3000`

---

## 🌙 Tema Escuro/Claro

Você pode alternar entre o modo claro e escuro através do botão no cabeçalho. A preferência de tema é salva no `localStorage`.

---

## 📌 Observações

- Certifique-se de que o backend está rodando corretamente antes de iniciar o frontend.
- Os dados são consumidos da CoinGecko, que tem limite de requisições por minuto em sua API gratuita.
- O projeto está pronto para deploy com Vercel (frontend) e Render/Heroku (backend).

---

## 🧠 Autor

Desenvolvido por **Artur Rodrigues** 🧑‍💻  
Engenharia de Software @ Universidade de Brasília  
LinkedIn: [linkedin.com/in/arturrodrigues](https://linkedin.com/in/arturrsa19)

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.
