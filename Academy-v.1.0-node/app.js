const express = require("express");
const bodyParser = require("body-parser");
const router = require('./src/router.js');

const app = express();
const HTTP_PORT = 3000;

// Здесь рекомендуется использовать такие модули для express как express-cors и helmet
// для правильной настройки заголовков касающихся безопасности

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', router);

// Отсутствует обработка ошибки в случае если приложению
// не удалось запуститься (первый аргумент в коллбеке - error)

// Start server
app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});

// Общие комментарии:
// в файле .gitignore отсутствовало упоминания файла db.sqlite -
// из за этого можно случайно закоммитить базу в репозитарий

// Рекомендуется отказаться от коллбеков при работе с базой данных в пользу промисов,
// это сильно упростит чтение и понимания кода

// Из файла package.json необходимо убрать все неиспользуемые модули - lodash, md5, uuid
// Метод PUT в роуте на измнение статьи лучше заменить на PATCH

// Необходимо установить линтер и прогнать им весь код - code-style не выдержан

// На всех роутах необходимо ввести валидацию и санитизацию данных
// В текущей ситуации не контролируется формат входящих данных из запроса
// Что позволяет производить sql иньекции
// Например: http://localhost:3000/api/article/1 UNION SELECT * FROM article where id=2
// Вернет информацию о статье с id=2, несмотря на то что мы запрашиваем статью под id=1