class Search extends Component {
  constructor() {
    super();
    this._onChange = null;
  }

  get template() {
    return `<input type="text" name="search" placeholder="Search">
      <button type="submit" class="visually-hidden">Search</button>`.trim();
  }

  removeEventListener() {
    this._element
      .removeEventListener(`keydown`, this._onSearchChange);
  }

  _onSearchChange(event) {

    console.log(this._onChange)

    if (typeof this._onChange === `function`) {
      this._onChange(event.target.value);
    }
  }
  set onChange(fn) {
    this._onChange = fn;
  }

  // Не используемый метод - из за этого не работает поиск
  setEventListener() {

    // В данном случае внутри функции this._onSearchChange будет потерян контекст выполнения

    this._element
      // .addEventListener(`keyup`, this._onSearchChange)
      // Один из способов сохранить контекст при вызове в  данной ситуации:
      .addEventListener(`keyup`, (event) => this._onSearchChange(event));
  }

}
