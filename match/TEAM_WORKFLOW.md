# 🚀 Match App - Guía de Trabajo del Equipo

## 👥 Equipo

### Founder y Líder de Proyecto

- Cristian

### Desarrolladores

- Frank
- Gabriela
- Yarmes

---

# 🎯 Objetivo

Mantener el código organizado, evitar conflictos y asegurar que cada desarrollador trabaje de manera independiente.

---

# 🌳 Estructura de Ramas

## Producción

```bash
main
```

Contiene únicamente código estable.

⚠️ Nadie desarrolla directamente en esta rama.

---

## Integración

```bash
develop
```

Aquí se integran todas las funcionalidades antes de pasar a producción.

---

## Funcionalidades

```bash
feature/auth
feature/profile
feature/chat
feature/home
feature/settings
feature/matching
feature/notifications
```

Cada desarrollador trabaja en una rama propia.

---

# 📋 Asignación Inicial

## Cristian (Founder)

Responsabilidades:

- Arquitectura
- UX/UI
- Revisión de código
- Integración final

Rama:

```bash
feature/home
```

---

## Frank

Responsabilidades:

- Login
- Registro
- Recuperación de contraseña

Rama:

```bash
feature/auth
```

---

## Gabriela

Responsabilidades:

- Perfil
- Configuración
- Edición de datos

Rama:

```bash
feature/profile
```

---

## Yarmes

Responsabilidades:

- Chat
- Matching
- Notificaciones

Rama:

```bash
feature/chat
```

---

# ⚙️ Configuración Inicial

## Crear rama develop

Solo Cristian:

```bash
git checkout main

git checkout -b develop

git push -u origin develop
```

---

# 💻 Primeros Pasos para Cada Desarrollador

## 1. Clonar el repositorio

```bash
git clone https://github.com/JCCR1711/Match-App.git

cd Match-App
```

---

## 2. Cambiar a develop

```bash
git checkout develop

git pull origin develop
```

---

## 3. Crear rama personal

### Frank

```bash
git checkout -b feature/auth
```

### Gabriela

```bash
git checkout -b feature/profile
```

### Yarmes

```bash
git checkout -b feature/chat
```

### Cristian

```bash
git checkout -b feature/home
```

---

## 4. Subir la rama por primera vez

Ejemplo:

```bash
git push -u origin feature/auth
```

---

# 🔄 Flujo Diario

Antes de comenzar:

```bash
git checkout develop

git pull origin develop
```

Cambiar a la rama personal:

```bash
git checkout feature/auth
```

Actualizar la rama:

```bash
git merge develop
```

---

# 💾 Guardar Cambios

```bash
git add .

git commit -m "Crear pantalla de login"

git push
```

---

# 📝 Convención de Commits

## Correcto

```bash
git commit -m "Crear pantalla de login"

git commit -m "Implementar autenticación"

git commit -m "Agregar validaciones de registro"

git commit -m "Diseñar perfil de usuario"

git commit -m "Implementar sistema de matching"
```

## Incorrecto

```bash
git commit -m "Cambios"

git commit -m "Fix"

git commit -m "Update"

git commit -m "asd"
```

---

# 🔀 Pull Requests

Cuando una funcionalidad esté terminada:

Subir cambios:

```bash
git push
```

Crear Pull Request:

```text
feature/auth
↓
develop
```

⚠️ Nunca hacia main.

---

# ✅ Revisión de Código

Proceso:

1. Desarrollador termina tarea.
2. Crea Pull Request.
3. Cristian revisa el código.
4. Se realizan correcciones si son necesarias.
5. Se aprueba.
6. Se fusiona en develop.

---

# 🚀 Publicación

Cuando la versión esté estable:

```text
develop
↓
main
```

Solo Cristian realiza esta acción.

---

# ❌ Prohibido

- Hacer push directo a main.
- Trabajar directamente en main.
- Modificar ramas de otros desarrolladores.
- Subir código sin probar.
- Hacer commits sin descripción.

---

# ✅ Obligatorio

- Trabajar en una rama propia.
- Hacer pull antes de comenzar.
- Crear Pull Request al terminar.
- Escribir commits descriptivos.
- Mantener comunicación con el equipo.

---

# 📁 Estructura del Proyecto

```text
Match-App
│
├── app/
├── src/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── screens/
│   ├── services/
│   ├── types/
│   └── utils/
│
├── package.json
├── app.json
└── tsconfig.json
```

---

# 📌 Resumen

| Miembro  | Rama            |
| -------- | --------------- |
| Cristian | feature/home    |
| Frank    | feature/auth    |
| Gabriela | feature/profile |
| Yarmes   | feature/chat    |

Flujo oficial:

```text
feature/*
↓
develop
↓
main
```

Nunca desarrollar directamente sobre `main`.
