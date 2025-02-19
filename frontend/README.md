# Plataforma Educativa de Análisis

Este proyecto es una plataforma educativa que utiliza análisis de video en tiempo real para detectar características faciales, emociones, género, edad, compromiso y estado de ánimo de los usuarios.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Componentes](#componentes)
  - [Componente de Género](#componente-de-género)
  - [Componente de Edad](#componente-de-edad)
  - [Componente de Emoción Dominante](#componente-de-emoción-dominante)
  - [Componente de Características](#componente-de-características)
  - [Componente de Compromiso](#componente-de-compromiso)
  - [Componente de Estado de Ánimo](#componente-de-estado-de-ánimo)
  - [Componente de Barras de Emoción](#componente-de-barras-de-emoción)
  - [Componente de Rastreo Facial](#componente-de-rastreo-facial)
- [Captura de Pantalla](#captura-de-pantalla)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/Gwchicango/monitoreo_de_usuarios.git
    ```
2. Navega al directorio del proyecto:
    ```bash
    cd monitoreo_de_usuarios
    ```
3. Instala las dependencias:
    ```bash
    npm install
    ```

## Uso

1. Inicia la aplicación:
    ```bash
    npm start
    ```
2. Abre tu navegador y navega a `http://192.168.100.244:3000`.

## Componentes

### Componente de Género
Detecta el género del usuario y muestra una imagen correspondiente.
* import GenderComponent from "./components/GenderComponent";

### Componente de Edad
Detecta la edad del usuario.
* import AgeComponent from "./components/AgeComponent";

### Componente de Emoción Dominante
* Detecta la emoción dominante del usuario.
import DominantEmotionComponent from "./components/DominantEmotionComponent";

### Componente de Características
Muestra las características faciales más destacadas del usuario.
* import FeatureComponent from "./components/FeatureComponent";

### Componente de Compromiso
Mide el nivel de compromiso del usuario.
* import EngagementComponent from "./components/EngagementComponent";

### Componente de Estado de Ánimo
Muestra el estado de ánimo del usuario y permite expandir o contraer la vista.
* import MoodComponent from "./components/MoodComponent";

### Componente de Barras de Emoción
Muestra barras que representan diferentes emociones del usuario.
* import EmotionBarsComponent from "./components/EmotionBarsComponent";

### Componente de Rastreo Facial
Rastrea la cara del usuario en tiempo real.
* import FaceTrackerComponent from "./components/FaceTrackerComponent";

### Contribuciones
Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request.