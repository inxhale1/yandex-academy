window.onload = () => {
	const FORM_WRAPPER = document.querySelector(`.column_type_input`);
	const ratingArray = [];
	let countedRating = 20;


  const renderSearch = (allItemsData) => {
    PageEnum.SiteWrapper.SEARCH.innerHTML = ``;

    const searchComponent = new Search();

    // Функцию .onChange необходимо обьявлять раньше чем вызов .render () - иначе эта функция никогда не будет вызвана
    // (см. конструктор родительского класса)
    searchComponent.onChange = (value) => {

      // Есть смысл сделать поиск независящим от регистра:
      // value = value.toLowerCase()
      // currentItem._names = currentItem._names.map(name => name.toLowerCase())

      const filteredItems = allItemsData.filter((currentItem) => currentItem._names.includes(value));
      PageEnum.SiteWrapper.rating.innerHTML = ``;
      if (value === ``) {
        ratingRender(countedRating, allItemsData);
      } else {
        ratingUpdate(filteredItems);
      }
    };

    PageEnum.SiteWrapper.SEARCH.appendChild(searchComponent.render());

  };

  const ratingRender = (ratingAmount, ratingArray) => {
    for (let i = 0; i < ratingAmount; i++) {
      ratingArray[i] = new PersonRating(returnRandomData());
    }
    ratingUpdate(ratingArray);
  };

  const ratingUpdate = (ratingArray) => {
    ratingArray.forEach((item) => {
      PageEnum.SiteWrapper.rating.appendChild(item.render());
    });
    if (ratingArray.length === 0) {
      PageEnum.SiteWrapper.rating.innerHTML = `Rating list is empty`
    }
  };

	const renderForm = () => {
		const formComponent = new Form();
		FORM_WRAPPER.appendChild(formComponent.render());

		formComponent.onSubmit = (evt) => {
			evt.preventDefault();

      // Отсутствует валидация формы
			// Необходимо проверять данные формы на наличие данных, а так же на их валидность

			// Неправильно используется считывание данных формы - необходимо проверять аттрибут .checked
			// Так же нужно держать в голове что у нас несколько элементов с name=cat|rest|money
			// Поэтому так же можно использовать querySelectorAll

			const name = document.querySelector(`input[name=name]`).value;
			// const cat = document.querySelector(`input[name=cat]`).value;
			// const rest = document.querySelector(`input[name=rest]`).value;
			// const money = document.querySelector(`input[name=money]`).value;

      const cat = document.querySelector(`input[name=cat]`).checked;
      const rest = document.querySelector(`input[name=rest]`).checked;
      const money = document.querySelector(`input[name=money]`).checked;

			const Man = new Person(name);
			if (cat) {
				Man.hasCat();
			}
			if (rest) {
				Man.hasRest();
			}
			if (money) {
				Man.hasMoney();
			}
			Man.isSunny()
				.then((happiness) => {
					Man._valueElement.innerHTML = name;
					if (happiness === 4) {
						Man._iconElement.innerHTML = '😆';
					} else if (happiness === 3 || happiness === 2) {
						Man._iconElement.innerHTML = '😐';
					} else {
						Man._iconElement.innerHTML = '☹️';
					}
				});
		}
	};

	renderForm();
  renderSearch(ratingArray);
	ratingRender(countedRating, ratingArray);
};

// Общие комментарии
// Код работает неверно - из за неправильного считывания данных форм (.value вместо .checked)
// счетчик "счастья" все время был равен цифре 3 или 4

// Поиск так же не работает - из за потери контекста в функции коллбека отвечающего за мок поиск
//
// Имеет смысл поработать там структурой файлов в проекте - например вынести все обьявления классов в отдельную папку

// Так же можно использовать линтер, либо набор готов практик (например standard https://github.com/standard/standard)
// для соблюдения code-style