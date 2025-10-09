## Project Structure

A continuación se detalla la estructura de directorios y archivos del proyecto.

WebProject/
├── Server/                   # Backend (Node.js/Express)
│   ├── config/               # Archivos de configuración
│   ├── middleware/           # Middlewares de Express (ej. autenticación)
│   │   └── auth.js
│   ├── models/               # Modelos de datos (Mongoose)
│   │   └── User.js
│   ├── routes/               # Definición de rutas de la API
│   │   ├── auth.js
│   │   ├── deals.js
│   │   ├── news.js
│   │   └── steam.js
│   ├── uploads/              # Directorio para archivos subidos
│   │   └── profiles/
│   ├── index.js              # Punto de entrada del servidor
│   └── package.json
│
├── web/                      # Frontend (React)
│   ├── public/               # Archivos estáticos y assets públicos
│   │   ├── index.html        # Plantilla HTML principal
│   │   └── ...               # Otros assets como imágenes e iconos
│   ├── src/                  # Código fuente de la aplicación React
│   │   ├── components/       # Componentes reutilizables de React
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   ├── UserProfile.js
│   │   │   └── ...
│   │   ├── context/          # Contexto de React (ej. AuthContext)
│   │   │   └── AuthContext.js
│   │   ├── hooks/            # Hooks personalizados de React
│   │   │   └── useAuthActions.js
│   │   ├── App.js            # Componente principal de la aplicación
│   │   ├── index.js          # Punto de entrada de la aplicación React
│   │   └── ...               # Otros archivos de la aplicación
│   ├── package.json
│   └── README.md
│
├── index.js                  # Posible punto de entrada raíz (si aplica)
├── package.json              # Dependencias y scripts del proyecto raíz
└── README.md                 # Documentación principal del proyecto
