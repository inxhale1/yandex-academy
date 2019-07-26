class Person extends Component {
    constructor(name) {
        super();

        // неиспользуемое свойство
        // имеет смысл использовать данную переменную после инициализации _valueElement
        // например так - _valueElement.innerHTML = name
        this.name = name;

        this._happiness = 0;
        this._valueElement = document.querySelector(`.column__value-name`);
        this._iconElement = document.querySelector(`.column__value-icon`);
    }

    // При использовании такой записи функция всегда будет возвращать предыдущее значение
    // Это поведение не совсем очевидно, и если оно не ожидается то предпочтительнее использовать
    // другую форму записи, например:
    //
    // this._happiness++
    // return this.happiness

    hasCat() {
        return this._happiness++;
    }

    hasRest() {
        return this._happiness++;
    }

    hasMoney() {
        return this._happiness++;
    }

    isSunny() {
        // Ключи, токены и ендпойнты для обращения к сторонним ресурсам желательно выносить в переменные окружения чтобы
        // было просто и легко задавать их при сборке приложения. В данном случае их можно вынести в отдельный файл для
        // удобного возможного переиспользования
        const APIKey = '28c7d687accc7c75aabbc7fb71173feb';
        const city = 'Москва';
        const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey;

        // Отсутствует обработка ошибок с помощью .catch
        return fetch(url)
            // Здесь следует проверить код ответа от сервера  - fetch не генерирует ошибку даже если сервер вернул 5xx или 4xx
            .then(res => res.json())
            // Здесь скобки можно опустить - .then(res => {})
            .then((res) => {
              // Сюда стоит добавить больше отладочной информации, например ответа с сервера
              console.log(this._happiness);
                // Прежде чем обращаться к вложенному свойству хорошо было бы удостовериться в его наличии чтобы не получить ошибку
                // если по какой-то причине сервер вернул что-то не то что мы ожидаем
                if (res.main.temp - 273 > 15) {

                    // В данном случае вернется число ДО его инкремента
                  // return this._happiness++

                  // Поэтому стоит воспользоваться другой формой записи:
                  this._happiness++
                  return this._happiness
                }
            });
      }
}
