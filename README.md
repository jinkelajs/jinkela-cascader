# Jinkela-Cascader

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
  
