# GimApp - Gestión de Gimnasio

GimApp es una aplicación web para la gestión de socios, rutinas y ejercicios de un gimnasio. Permite a los usuarios gestionar su cuenta, ver rutinas asginadas, y a los administradores gestionar socios, rutinas y ejercicios.

## Tecnologías

- **Frontend:** React, React Bootstrap, React Router, Vite

## Instalación

1. Clonar el repositorio

```sh
git clone https://github.com/mattigomez/tpi-gimApp.git
```

2. Instalar dependencias

```sh
npm install
```

3. Iniciar la aplicación

```sh
npm run dev
```


## Estructura del proyecto (Frontend)

```
src/
│   App.jsx
│   index.css
│   main.jsx
│
├── assets/
│   └── logowhite-GYMHUB.png
│
├── components/
│   ├── account/
│   │   └── Account.jsx
│   ├── auth/
│   │   ├── auth.services.js
│   │   └── login/
│   │       ├── login.css
│   │       └── Login.jsx
│   ├── dashboard/
│   │   └── Dashboard.jsx
│   ├── header/
│   │   └── Header.jsx
│   ├── home/
│   │   └── Home.jsx
│   ├── newRoutine/
│   │   └── NewRoutine.jsx
│   ├── partners/
│   │   └── Partners.jsx
│   ├── routes/
│   │   ├── notFound/
│   │   │   └── NotFound.jsx
│   │   └── protected/
│   │       └── Protected.jsx
│   ├── routineItem/
│   │   ├── routineItem.css
│   │   └── RoutineItem.jsx
│   ├── routines/
│   │   └── Routines.jsx
│   └── toggleTheme/
│       └── ToggleTheme.jsx
│
└── services/
    ├── authFetch.js
    ├── jwtDecode.js
    ├── authContext/
    │   ├── Auth.context.jsx
    │   └── AuthContextProvider.jsx
    └── theme/
        ├── theme.context.jsx
        ├── ThemeContextProvider.consts.js
        └── ThemeContextProvider.jsx
```

## Integrantes

- Matias Gomez
- Juan Manuel Lantermo
- Juan Pablo Fernandez
- Santiago Oller
