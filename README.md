![NestJS](nestjs.svg)

## Настройка сборки проекта

1. Создаём новый item на Jenkins сервере:
   https://jenkins.citronium.com/view/all/newJob

- Называем его ИМЯПРОЕКТА_api_build
- Настройки копируем из base_api_build

2. Переходим в Jenkinsfile, который лежит в корне репозитория. Здесь нужно определить переменные для сборки:

- repositoryName - имя репозитория проекта в GitHub
- jenkinsURL - ссылка на выкладку сервера (можно заполнить позже)
- def chatId - ID чата в Телеграмме с ботом (можно заполнить позже)
- def token - Токен чатбота в Телеграмме (можно заполнить позже)

3. В config/staging.ts нужно указать в качестве параметра db.database имя проекта

4. Теперь после push в репозиторий происходит автоматическая сборка.
   Посмотреть сборку можно по адресу: https://jenkins.citronium.com/view/Base/job/base_api_build/

## Системные требования для локального запуска проекта

node.js >= 14

yarn = 1.22.10

## Локальный запуск проекта

0. Указать подключение к БД Postgres в файле ./config/development.ts
1. Выполнить команду yarn
1. Выполнить команду yarn build
1. Выполнить команду yarn html
1. Выполнить команду node dist/src/main.js

## Локальная сборка и запуск проекта в Docker

1. docker build -t base-api .
2. docker run -p 3002:3002 --name base-api base-api:latest

## Проверка кода

yarn lint

## Автоформатирование кода

yarn format

## Переменные окружения

- Default - содержит все параметры, подгружается всегда по умолчанию.
- Development - загружается по умолчанию, если NODE_ENV не указана. Используем для локальной разработки.
- Staging - тестовый сервер.
- Production - продакшен сервер.
- Test - для e2e тестов.

Для каждого backend-developer для локальной разработки следует использовать свою базу данных,
чтобы не затирать автомиграциями другие (общие) базы.
В конфиге development прописываем:
db_development_USERNAME (ivan, igor, etc.)

## Структура проекта

Общая структура проекта была построена на основе [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

```
.
├── Dockerfile // Dockerfile для самого приложения
├── Dockerfile.build // Dockerfile для сборки приложения при помощи Jenkins
├── Jenkinsfile // Конфигурационный файл
├── README.md // Описание проекта
├── e2e // Папка для e2e тестов
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── nest-cli.json // Файл конфигурации nest-cli
├── package-lock.json
├── package.json
├── src // В данной папке должны лежать только исходники приложения
│   ├── application // Слой Application, содержит реализацию бизнесс логики приложения
│   │   └── services
│   │       └── app.service.ts
│   ├── core // Слой ядра приложения, тут только объекты привязанные к доменной области проекта
│   │   ├── common // Папка для общих элементо которые могу использовать элементы ядра. (Валидация и прочее)
│   │   └── domain // Папка для доменной области перед началом работы нужно переименовать и для каждого домена создавать свою папку
│   │       ├── entity // Объекты описывающие домен
│   │       ├── repository // Интерфейсы для слоя персистетности
│   │       └── service // Папка для хранения сервисов
│   │           └── customNameDomainService // Папка по каждый сервис для доменной области должна содержать интерфейсы самого сервиса и аргументы. Читайте про UseCase http://www.plainionist.net/Implementing-Clean-Architecture-UseCases/. В даннйо папке должны храниться таже входные и выходные аргументы для сервиса.
│   │               ├── customNameServiceArgument.ts
│   │               └── customNameServiceResult.ts
│   ├── infrastrucutre // Папка для инфраструктурного слоя
│   │   ├── interceptor // Хранение обработчиков nest
│   │   ├── module // Хранение модулей nest
│   │   │   └── app.module.ts
│   │   ├── persistence // Папка для слоя персистетности
│   │   ├── presenter // папка для слоя отображения
│   │   │   └── rest-api
│   │   │       ├── controller
│   │   │       │   └── app.controller.ts
│   │   │       ├── documentation
│   │   │       └── version
│   │   ├── response // Тут должны лежать файлы с ответами
│   │   ├── server // Конфигурация HTTP сервера
│   │   └── typeorm // КОнфигурация typeorm
│   └── main.ts
├── test  // Папка для тестов
│   └── app.controller.spec.ts
├── tsconfig.build.json
└── tsconfig.json
```
