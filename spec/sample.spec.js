/**
 * Author: liquidvibr
 * Created using JetBrains PhpStorm
 * Date: 2/12/12
 * Time: 1:25 PM
 */
// a helper function to display some results in a clear way
var toStr = function(item){
    switch (true) {
        case item===false: return 'false';
        case item==="false": return '"false"';
        case item===true: return 'true';
        case item==="true": return '"true"';
        case item===null: return 'null';
        case item===undefined: return 'undefined';
        default: return item.toString();
    }
};

// the test suite
describe("jQuery.sample", function() {
    
    var 
        tmpl, html,el // basic vars used in each test
    ;

    describe("sampling with a basic template and data", function() {

        it("sets inner text of a div,span,a,p", function() {

            tmpl = '<div class="a"></div><span class="b"></span><a class="c" href=""></a><p class="d"></p>';
            html = $.sample(tmpl, { a:1, b:2, c:3, d:4, e:5 });
            expect(html).toBe('<div class="a">1</div><span class="b">2</span><a class="c" href="">3</a><p class="d">4</p>');
        });

        it("accepts an array of data and multiplies the template", function() {
        	tmpl = '<p class="a"></p>';
            html = $.sample(tmpl, [
                {a:1},
                {a:2}
            ]);
            expect(html).toBe('<p class="a">1</p><p class="a">2</p>')
        });

        it("sets values of input,textarea,select", function() {

            tmpl = '<input class="a"/><textarea class="b"></textarea><select class="c"><option value="1"></option><option value="3"></option></select>';

            el = $(tmpl).sample({ a:1, b:2, c:3, d:4, e:5 });

            var t= function(s) { return el.filter(s) };

            expect(t('.a').val()).toBe('1');
            expect(t('.b').val()).toBe('2');
            expect(t('.c').val()).toBe('3');
        });

        $.each(['checked',true,1,'true'], function(k,v) {
           var tmpl = '<input type="checkbox" class="a">';

           it("makes checkbox checked using value "+toStr(v), function() {
                el = $(tmpl).sample({ a:v });
               expect(el).toBeChecked();
           });
        });
        $.each(['false',0,false], function(k,v){
           var tmpl = '<input type="checkbox" class="a">';

           it("makes checkbox unchecked using value "+toStr(v), function() {
                el = $(tmpl).sample( { a:v } );
               expect(el).not.toBeChecked();
           });
        });

    });

    describe("using maps", function() {
    	
        it("sets an inner text, html and href attribute of a tag", function() {

            tmpl = '<a href="" class="a"></a><a href="" class="b"></a><a href="" class="c"></a>';

            el = $(tmpl).sample(
                { href1:1, a:2, href2:3, txt2:4, html:'<p>5</p>' }, // data
                { '.a/href':'href1', '.b/href':'href2', '.b/text':'txt2', '.c/html':'html' }); // map

            var expected = '<a href="1" class="a">2</a><a href="3" class="b">4</a><a href="" class="c"><p>5</p></a>';
            var is = $('<p/>').append(el);

            expect(is).toHaveHtml(expected);
    	});
        it("sets a checkbox to checked", function() {

        	tmpl = '<input type="checkbox" class="a">';
            el = $(tmpl).sample({zz:'true'}, {'.a/checked':'zz'});

            expect(el).toBeChecked();
        });
        it("sets a value an attribute of an input", function() {

            tmpl = '<input class="a">';
            el = $(tmpl).sample( {theval:'1',theattr:'2'} , {'.a/val':'theval','.a/title':'theattr'} );

            expect(el).toHaveAttr('title','2');
            expect(el).toHaveValue('1');
        });
        it("creates options in a select tag based on an array of {value:x,text:y} objects", function() {

            tmpl = '<select class="a"></select>';
            el = $.sample(tmpl, {
                a:[
                    {value:1, text:'a'},
                    {value:2, text:'b'},
                    {value:3, text:'c'}
                ]} ,{'.a/options':'a'});

            expect(el).toEqual('<select class="a"><option value="1">a</option><option value="2">b</option><option value="3">c</option></select>')
        });
        it("creates options in a select tag based on an array of {value:x} objects", function() {

            tmpl = '<select class="a"></select>';
            el = $.sample(tmpl, {a:[
                {value:1},
                {value:2},
                {value:3}
            ]}, {'.a/options':'a'});

            expect(el).toEqual('<select class="a"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>')
        });
        it("creates options in a select tag based on an array of {text:x} objects", function() {

            tmpl = '<select class="a"></select>';
            el = $.sample(tmpl, {a:[
                {text:1},
                {text:2},
                {text:3}
            ]}, {'.a/options':'a'});
            expect(el).toEqual('<select class="a"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>')
        });
        it("creates options in a select tag based on an array [a,b,c] of values", function() {

            tmpl = '<select class="a"></select>';
            el = $.sample(tmpl, {a:[1, 3, 7]}, {'.a/options':'a'});
            expect(el).toEqual('<select class="a"><option value="1">1</option><option value="3">3</option><option value="7">7</option></select>')
        });
        it("creates options and sets the value too", function() {
            tmpl = '<select class="a"></select>';
            el = $(tmpl).sample({
                a_op:[1, 3, 7], // this is the option collection
                a:3 // this is the value, which we will not map, but let the default mapper handle
            }, {'.a/options':'a_op'});
            expect($(el).val()).toEquate(3)
        });
        it("creates options and sets the value using a map item", function() {
            tmpl = '<select id="nnn" class="a"></select>';
            el = $(tmpl).sample({
                a_op:[1, 3, 7], // this is the option collection
                a:3, // this is the value, which we will not map, but let the default mapper handle
                b:7 // this is the mapped item, and the map matcher should overwrite the above match
            }, {'.a/options':'a_op', '.a/value':'b'});
            expect(el.val()).toEquate(7)
        });
        it("creates options and sets the value, but, if html is rendered to text the value will not be set", function() {
            tmpl = '<select class="a"></select>';
            el = $.sample(tmpl,{
                a_op:[1, 3, 7], // this is the option collection
                a:3 // this is the value, which we will not map, but let the default mapper handle
            }, {'.a/options':'a_op'});
            expect($(el).val()).not.toEquate(3)
        });

        
    });
});
