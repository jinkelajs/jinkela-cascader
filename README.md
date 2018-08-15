# Jinkela-Cascader

## Install

```bash
yarn install jinkela-cascader
```

## Usage

### new Cascader([args])

* `args` **Object** Set of configurable options to set. Can have the following fields:
  * `defaultValue` **Any** The default value.
  * `placeholder` **String** The placeholder text.
  * `options` **Array&lt;option&gt;** Cascading options.

* `option` **Object** The cascading option item. Can have the following fields:
  * `value` **Any** The item value. Defaults to `text`. 
  * `text` **String** The item text. Defaults to `value`. 
  * `options` **Array&lt;option&gt;** sub-options.

## Demo

```html
<script src="https://unpkg.com/jinkela@1.2.19/umd.js"></script>
<script src="https://unpkg.com/jinkela-cascader@1.0.0/index.js"></script>
<script>
addEventListener('DOMContentLoaded', () => {

  new Cascader({
    options: [
      {
        text: 'item 1', options: [
          { text: 'item 1.1' },
          { text: 'item 1.2' }
        ] 
      },
      { text: 'item 2' }
    ] 
  }).to(document.body);

});
</script>
```
