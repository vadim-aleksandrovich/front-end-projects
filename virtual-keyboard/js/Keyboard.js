import * as storage from './storage.js';
import create from './utils/create.js';
import language from './layouts/index.js'; // { en, ru }
import Key from './Key.js';

const main = create('main', '');

export default class Keyboard {
  constructor(rowsOrder) {
    this.rowsOrder = rowsOrder;
    this.keysPressed = {};
    this.isCaps = false;
  }

  init(langCode) {
    this.keyBase = language[langCode];
    this.audioList = ['boom','clap','hihat','kick','openhat','boom','ride','snare','tink','tom'];
    this.output = create('textarea', 'output', null, main,
      ['placeholder', 'Click here to show a keyboard'],
      ['rows', 5],
      ['cols', 50],
      ['spellcheck', false],
      ['autocorrect', 'off']);
    this.container = create('div', 'keyboard keyboard_close', null, main, ['language', langCode]);
    this.audioElements = [];

    this.audioList.forEach((elem) => {
      const audioElem = create('audio', '', null, main, ['src',`./sound/${elem}.wav`], ['name',`${elem}`])
      this.audioElements.push(audioElem);
      });

    document.body.prepend(main);
    return this;
  }

  generateLayout() {
    this.keyButtons = [];
    this.rowsOrder.forEach((row, i) => {
      const rowElement = create('div', 'keyboard__row', null, this.container, ['row', i + 1]);
      rowElement.style.gridTemplateColumns = `repeat(${row.length}, 1fr)`;
      row.forEach((code) => {
        const keyObj = this.keyBase.find((key) => key.code === code);
        if (keyObj) {
          const keyButton = new Key(keyObj);
          this.keyButtons.push(keyButton);
          rowElement.appendChild(keyButton.div);
        }
      });
    });

    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);
    this.container.onmousedown = this.preHandleEvent;
    this.container.onmouseup = this.preHandleEvent;

    this.output.addEventListener('click', this.keyboadShow);
  }

  keyboadShow = () => {
    this.container.classList.remove('keyboard_close');
}



  preHandleEvent = (e) => {
    e.stopPropagation();
    const keyDiv = e.target.closest('.keyboard__key');
    if (!keyDiv) return;
    const { dataset: { code } } = keyDiv;
    keyDiv.addEventListener('mouseleave', this.resetButtonState);
    this.handleEvent({ code, type: e.type });
  };

  resetButtonState = ({ target: { dataset: {code} } }) => {
    const keyObj = this.keyButtons.find((key) => key.code === code);
    if (!code.match(/Mute|Caps/)){
        keyObj.div.classList.remove('active');
    }
    keyObj.div.removeEventListener('mouseleave', this.resetButtonState);
}

  handleEvent = (e) => {
    if (e.stopPropagation) e.stopPropagation(); // Отключаем обработку клика
    const { code, type } = e;
    const keyObj = this.keyButtons.find((key) => key.code === code);
    const audio = this.audioElements;
    if (!audio || !keyObj) return;
    this.output.focus();

    if (type.match(/keydown|mousedown/)) {
      if (type.match(/key/)) e.preventDefault(); // Отключаем станартное поведение клавиатуры
      if (code.match(/Shift/)) this.shiftKey = true;
      if (this.shiftKey) {
        this.switchUpperCase(true);}
      if(code.match(/Done/)) this.container.classList.add('keyboard_close');

      // Switch language
      if (code.match(/LangBtn/)) this.switchLanguage();

      keyObj.div.classList.add('active'); // Подсвечиваем нажатую кнопку

      //? Caps Lock switcher;
      if (code.match(/Caps/) && !this.isCaps) {
        this.isCaps = true;
        this.switchUpperCase(true);
      } else if (code.match(/Caps/) && this.isCaps) {
        this.isCaps = false;
        this.switchUpperCase(false);
        keyObj.div.classList.remove('active');
      }

      // let currentLang = this.container.dataset.language;
      // console.log(currentLang);
      //? Mute Switcher;
      if (code.match(/Mute/) && !this.isMute) {
        this.isMute = true;
    } else if (code.match(/Mute/) && this.isMute) {
        this.isMute = false;
        keyObj.div.classList.remove('active');
    }
    if (!this.isMute) {

      if (this.container.dataset.language === 'en' && !keyObj.isFnKey) {
          audio[0].currentTime = 0;
          audio[0].play();
      };

      if (this.container.dataset.language === 'ru' && !keyObj.isFnKey) {
        audio[1].currentTime = 0;
        audio[1].play();
      };

      if (keyObj.code.match(/Shift/)) {
          audio[2].currentTime = 0;
          audio[2].play();
      };

      if (keyObj.code.match(/Caps/)) {
          audio[3].currentTime = 0;
          audio[3].play();
      };

      if (keyObj.code.match(/Backspace/)) {
          audio[4].currentTime = 0;
          audio[4].play();
      };

      if (keyObj.code.match(/Enter/)) {
          audio[5].currentTime = 0;
          audio[5].play();
      };
  }

      if (!this.isCaps) {
        this.printToOutput(keyObj, this.shiftKey ? keyObj.shift : keyObj.small);
      } else if (this.isCaps) {
        if (this.shiftKey) {
          this.printToOutput(keyObj, keyObj.sub.innerHTML ? keyObj.shift : keyObj.small);
        } else {
          this.printToOutput(keyObj, !keyObj.sub.innerHTML ? keyObj.shift : keyObj.small);
        }
      }
      // release button
    } else if (type.match(/keyup|mouseup/)) {


      if (!code.match(/Shift/)) {
        this.shiftKey = false;
        this.switchUpperCase(false);
      }

      if (!code.match(/Caps|Mute/)) keyObj.div.classList.remove('active'); // Снимаем подсветку с нажатой клавиши
    }
  }

  switchLanguage = () => {
    const langAbbr = Object.keys(language); // получаем ['en', 'ru']
    let langIdx = langAbbr.indexOf(this.container.dataset.language); // 1
    this.keyBase = langIdx + 1 < langAbbr.length ?
                   language[langAbbr[langIdx += 1]]:
                   language[langAbbr[langIdx -= langIdx]];

    this.container.dataset.language = langAbbr[langIdx];
    storage.set('kbLang', langAbbr[langIdx]);

    this.keyButtons.forEach((button) => {
      const keyObj = this.keyBase.find((key) => key.code === button.code);
      if (!keyObj) return;
      button.shift = keyObj.shift;
      button.small = keyObj.small;
      if (keyObj.shift && keyObj.shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/g)) {
        button.sub.innerHTML = keyObj.shift;
      } else {
        button.sub.innerHTML = '';
      }
      button.letter.innerHTML = keyObj.small;
    });

    if (this.isCaps) this.switchUpperCase(true);
  }

  switchUpperCase(isTrue) {
    if (isTrue) {
      this.keyButtons.forEach((button) => {
        if (button.sub) {
          if (this.shiftKey) {
            button.sub.classList.add('sub-active');
            button.letter.classList.add('sub-inactive');
          }
        }

        if (!button.isFnKey && this.isCaps && !this.shiftKey && !button.sub.innerHTML) {
          button.letter.innerHTML = button.shift;
        } else if (!button.isFnKey && this.isCaps && this.shiftKey) {
          button.letter.innerHTML = button.small;
        } else if (!button.isFnKey && !button.sub.innerHTML) {
          button.letter.innerHTML = button.shift;
        }
      });
    } else {
      this.keyButtons.forEach((button) => {
        if (button.sub.innerHTML && !button.isFnKey) {
          button.sub.classList.remove('sub-active');
          button.letter.classList.remove('sub-inactive');
          if (!this.isCaps) {
            button.letter.innerHTML = button.small;
          } else if (!this.isCaps) {
            button.letter.innerHTML = button.shift;
          }
        } else if (!button.isFnKey) {
          if (this.isCaps) {
            button.letter.innerHTML = button.shift;
          } else {
            button.letter.innerHTML = button.small;
          }
        }
      });
    }
  }

  printToOutput(keyObj, symbol) {
    let cursorPos = this.output.selectionStart;
    const left = this.output.value.slice(0, cursorPos);
    const right = this.output.value.slice(cursorPos);

    const fnButtonsHandler = {
      Tab: () => {
        this.output.value = `${left}\t${right}`;
        cursorPos += 1;
      },
      ArrowLeft: () => {
        cursorPos = cursorPos - 1 >= 0 ? cursorPos - 1 : 0;
      },
      ArrowRight: () => {
        cursorPos += 1;
      },
      ArrowUp: () => {
        const positionFromLeft = this.output.value.slice(0, cursorPos).match(/(\n).*$(?!\1)/g) || [[1]];
        cursorPos -= positionFromLeft[0].length;
      },
      ArrowDown: () => {
        const positionFromLeft = this.output.value.slice(cursorPos).match(/^.*(\n).*(?!\1)/) || [[1]];
        cursorPos += positionFromLeft[0].length;
      },
      Enter: () => {
        this.output.value = `${left}\n${right}`;
        cursorPos += 1;
      },
      Delete: () => {
        this.output.value = `${left}${right.slice(1)}`;
      },
      Backspace: () => {
        this.output.value = `${left.slice(0, -1)}${right}`;
        cursorPos -= 1;
      },
      Space: () => {
        this.output.value = `${left} ${right}`;
        cursorPos += 1;
      },
    }

    if (fnButtonsHandler[keyObj.code]) fnButtonsHandler[keyObj.code]();
    else if (!keyObj.isFnKey) {
      cursorPos += 1;
      this.output.value = `${left}${symbol || ''}${right}`;
    }
    this.output.setSelectionRange(cursorPos, cursorPos);

  }

}