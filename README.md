#jQuery.sample

The idea is to avoid having facial hair in your templates by using clean and clear HTML. 
The idea was not had by me, but belongs to hij1nx and his incomplete, but still 
wonderful weld.js @ https://github.com/hij1nx/weld


##How to Sample

###Required Files

```html
<script src="jquery.js" type="text/javascript"></script>
<script src="jquery.sample.js" type="text/javascript"></script>
```

###An Example Template

```html
<div id='robots'>
  <div class='robot'>
     <span class='name'></span> 
     <a href='/robots' class='model'></a>
  </div>
</div>
```

###Automatic Binding

The automatic method simply looks for attributes class, id, or name and matches them to the data passed.

```javascript
$('.robot').sample({name:'zigzag', model:'blacksheep'});
// this would also work
$('#robots').sample({name:'zigzag', model:'blacksheep'});
// so would this
$('body').sample({name:'zigzag', model:'blacksheep'});
```

The attributes are set depending on the element:

```
input: value or checked
img: src
label: will prepend text
evertything else: will set the inner text of using jQuery .text() method
```

This is nice but we have many robots with different names:

```javascript
data = [
   {name:'zigzag',   model:'blacksheep'}, 
   {name:'twizzler', model:'blacksheep'}
];
$('#robots').sample(data)
```

This will clone the element and insert the sampled items after the original.


###Mapped Binding

Now we want the model anchor to link us to individual model's URL's. This is what maps are used for:

```javascript
data = {name:'zigzag', model:'blacksheep', linkUrl:'/robots/blacksheep'};
map  = {'.model/href':'linkUrl'};
$('.robot').sample(data, map )
```

This will perform the basic matching and overlap it with the mapping.


###Fun with Maps

```javascript
data = {colors : ['red','green','purple']} 
map  = {'select.color/options': colors}

data = { 
  colors : [
    {text:'red',value:'1'},
    {text:'green',value:'2'},
    {text:'purple',value:'3'}
  ], 
  selectedColor: '3' 
};
map  = {'select.color/options': 'colors', 'select.color/value': 'selectedColor'}

data = {isEvil:false}
map = {"input.evil/checked": 'isEvil'}
```


###Map Structure

```javascript
map = {'selector/property' : 'data key name', repeat... }
```

Special properties are: html, text (alias: txt), value (alias: val), checked, and options.
All others, will be added as tag attributes.


###Html Strings

You can use `var sampledHtml = $.sample (html, data, map)` to obtain an html string of sampled results directly, 
the rest of the syntax being the same as described above.

Now go sample some stuff!


## License

(The MIT License)

Copyright (c) 2011 liquidvibr @ https://github.com/bijoutrouvaille

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.





