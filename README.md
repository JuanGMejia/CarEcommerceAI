# 🚗 CarEcommerceAI

**CarEcommerceAI** is an AI-powered web application designed to enhance the car-buying experience through personalized conversations, advanced search, and seamless authentication using Azure Active Directory. Built with Angular and integrated with OpenAI, this platform offers smart, scalable solutions for modern automotive e-commerce platforms.

---

## 📌 Features

- 🔐 **Single Sign-On (SSO)** with Azure AD using MSAL
- 🤖 **AI-powered chat assistant ("Alfred")** for guided car discovery
- 🧩 **Modular architecture** with shared services, guards, and interceptors
- 📦 **Runtime environment configuration** via external JS (`runtime-config.js`)
- 🌐 **Responsive UI** using Angular Material

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── authentication/           # MSAL Auth config, login, guards
│   ├── components/               # Main UI components
│   │   └── chat/                 # Alfred AI chat interface
│   ├── services/                 # API & Chat services
│   ├── shared/                   # Shared guards, interceptors
├── assets/
│   └── runtime-config.js         # Environment vars (CLIENT_ID, TENANT_ID)
├── index.html
├── main.ts
```

---

## ⚙️ Architecture Overview

The app is a **modular Angular SPA** that authenticates users through **Microsoft Azure Active Directory (MSAL)** and enables them to interact with an AI assistant (powered by OpenAI) to browse vehicles. Key architecture elements:

- **Frontend**: Angular 16+
- **Auth**: MSAL for Angular with runtime-injected Azure credentials
- **Chat Integration**: Service layer communicating with backend AI endpoints
- **Runtime Config**: Credentials injected via `/assets/runtime-config.js` to support deployment flexibility (no rebuilds required)

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/JuanGMejia/CarEcommerceAI.git
cd CarEcommerceAI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Azure SSO

Update `src/assets/runtime-config.js` with your Azure AD details:

```js
window.__env = {
  CLIENT_ID: '<your-azure-client-id>',
  TENANT_ID: '<your-azure-tenant-id>'
};
```

### 4. Run the app locally

```bash
npm start
# or
ng serve
```

Visit: [http://localhost:4200](http://localhost:4200)

---

## 🧪 Testing

Run unit tests using:

```bash
ng test
```

---

## 🐳 Docker Support

If you're using the provided Dockerfile:

```bash
docker build -t car-ecommerce-ai .
docker run -p 4200:80 car-ecommerce-ai
```

---

## 🧠 Future Enhancements

- Integration with a car inventory backend API
- OpenAI integration for recommendation engine
- Deployment on Azure Static Web Apps with secure CI/CD

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙋 Support

If you have questions, issues, or suggestions, feel free to open an issue or contact the project maintainers.
