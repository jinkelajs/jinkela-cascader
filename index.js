{

  const PANEL_CLASS_NAME = 'jinkela_cascader_' + Array.from({ length: 16 }, () => (36 * Math.random() | 0).toString(36)).join('');

  class CascaderItem extends Jinkela {
    get tagName() { return 'li'; }
    beforeParse(params) {
      if (!('value' in params)) params.value = params.text;
      if (!('text' in params)) params.text = params.value;
    }
    init() {
      this.element.jinkela = this;
      this.element.textContent = this.text;
      if (this.options) this.element.classList.add('has-children');
    }
    set isActive(value) {
      if (value) {
        this.element.classList.add('active');
      } else {
        this.element.classList.remove('active');
      }
    }
    get isActive() {
      return this.element.classList.contains('active');
    }
    get styleSheet() {
      return `
        :scope {
          font-size: 14px;
          padding: 8px 30px 8px 10px;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #48576a;
          height: 36px;
          line-height: 1.5;
          box-sizing: border-box;
          cursor: pointer;
          &:hover {
            background-color: #e4e8f1;
          }
          &.active {
            background-color: #20a0ff;
            color: #fff;
          }
          &.active:hover {
            background-color: #1c8de0;
          }
          &.has-children::after {
            content: '';
            position: absolute;
            margin: auto;
            width: 0;
            height: 0;
            right: 12px;
            top: 0;
            bottom: 0;
            border: 5px solid transparent;
            border-left-color: #bfcad9;
          }
        }
      `;
    }
  }

  class CascaderMenu extends Jinkela {
    get tagName() { return 'ul'; }
    init() {
      let { options, level } = this;
      this.list = CascaderItem.from(options.map(option => Object.assign({ level }, option))).to(this);
    }
    setValueAndGetChildOptions(value) {
      let item = this.list.filter(item => (item.isActive = item.value === value)).pop();
      if (!item) return;
      return item.options;
    }
    get styleSheet() {
      return `
        :scope {
          display: inline-block;
          vertical-align: top;
          height: 204px;
          background-color: #fff;
          border-left: 1px solid #d1dbe5;
          box-sizing: border-box;
          margin: 0;
          overflow: auto;
          padding: 6px 0;
          min-width: 160px;
          &:first-child {
            border-left: 0;
          }
        }
      `;
    }
  }

  class CascaderPanel extends Jinkela {
    init() {
      this.cache = {};
      this.element.jinkela = this;
      this.element.addEventListener('click', event => this.click(event));
      this.element.classList.add(PANEL_CLASS_NAME);
      this.update();
    }
    update() {
      let { options, value } = this.cascader;
      while (this.element.firstChild) this.element.firstChild.remove();
      for (let level = 0; options; level++) {
        let args = { options, level };
        let cacheKey = JSON.stringify(args);
        let menu = this.cache[cacheKey] = this.cache[cacheKey] || new CascaderMenu(args);
        menu.to(this);
        options = menu.setValueAndGetChildOptions(value[level]);
      }
    }
    click(event) {
      let { jinkela } = event.target;
      if (!jinkela) return;
      let { level, value, options } = jinkela;
      this.cascader.value = this.cascader.value.slice(0, level).concat([ value ]);
      if (!options) this.hide();
    }
    show() {
      let rect = this.cascader.element.getBoundingClientRect();
      this.element.style.top = rect.top + rect.height + 5;
      this.element.style.left = rect.left;
      document.body.appendChild(this.element);
    }
    hide() {
      this.element.remove();
    }
    hideIfOut(target) {
      if (this.element.contains(target) || this.element === target || this.cascader.element.contains(target) || this.cascader.element === target) return;
      this.hide();
    }
    get styleSheet() {
      return `
        :scope {
          position: absolute;
          transform-origin: center top 0px;
          z-index: 2005;
          border: 1px solid #d1dbe5;
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
          overflow: auto;
          border-right: 1px solid #d1dbe5;
          background-color: #fff;
          box-sizing: border-box;
        }
      `;
    }
  }

  class Cascader extends Jinkela {
    beforeParse(params) {
      params.placeholder = params.placeholder || 'Cascader Selector';
    }
    init() {
      if (this.readonly) this.input.setAttribute('disabled', 'disabled');
      this.panel = null;
      if (!this.$hasValue) this.value = void 0;
    }
    focus() {
      if (this.readonly) return;
      if (!this.panel) this.panel = new CascaderPanel({ cascader: this });
      this.panel.show();
    }
    blur() {
      // ...
    }
    get template() {
      return `
        <div>
          <input ref="input" type="input" placeholder="{placeholder}" on-focus="{focus}" on-blur="{blur}" readonly="readonly" />
        </div>
      `;
    }
    set value(value = this.defaultValue) {
      if (!(value instanceof Array)) value = [];
      this.$hasValue = true;
      this.$value = value;
      this.input.value = value.join(' / ');
      if (this.panel) this.panel.update();
    }
    get value() { return this.$value; }
    get styleSheet() {
      return `
        :scope {
          display: inline-block;
          position: relative;
          font-size: 14px;
          overflow: hidden;
          font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
          -webkit-font-smoothing: antialiased;
          > input {
            border-radius: 4px;
            box-sizing: border-box;
            height: 36px;
            width: 222px;
            padding: 3px 10px;
            border: 1px solid #bfcbd9;
            transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            &:hover {
              border-color: #8391a5;
            }
            &:focus {
              outline: none;
              border-color: #20a0ff;
            }
            &[disabled] {
              background-color: #eff2f7;
              border-color: #d3dce6;
              color: #bbb;
              cursor: not-allowed;
              &:hover {
                border-color: #d3dce6;
              }
            }
          }
        }
      `;
    }
  }

  addEventListener('click', event => {
    let list = document.querySelectorAll('.' + PANEL_CLASS_NAME);
    for (let i = 0; i < list.length; i++) {
      list[i].jinkela.hideIfOut(event.target);
    }
  });

  window.Cascader = Cascader;

}
