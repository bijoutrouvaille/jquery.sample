/**
 * Author: liquidvibr - liquidripples@github
 * Created using JetBrains PhpStorm
 * Date: 2/11/12
 * Time: 3:49 PM
 * MIT Licence
 *
 * Inspired by weld.js and Plates.js
 *
 */
(function( $ ){
    var checkItem = function(el,val){
        var checked = !!~[true,'true','checked',1].indexOf(val);
        el.attr('checked', checked);
    };
    var findElement = function(haystack,selector) {
        var el = $(selector, haystack);
        if (!el.length) {
            /* search both the inner html and the outer tag */
            el = haystack.filter(selector).first()
        }
        return el;
    };
	var methods = {
		useTmpl: function (data, map) {
            map = map || {};
            data = data || {};
			data = data.toJSON && data.toJSON() || data;

            var that = this,
                el,isSimple,
                inputTag = "input,select,option,button,textarea",
                checkboxTag = ":checkbox",
                imageTag = "img",
                labelTag = "label"
                //textareaTag = "textarea"
                ;

            if ($.isArray(data))
            {
                var output = $('<p/>')
                    /*
                     we wrap the element to ensure the the outside html is counted as well
                     later we use the children of the resulted element, thus unwrapping it back
                    */
                    ,cloneHtml = $('<p></p>').append(that.clone()).html()
                    ;
                $.each(data, function(k,v){

                    el = methods.useTmpl.call($(cloneHtml),v, map);
                    /* unwrapping here */
                    output.append(el.children());
                });

                this.empty().append(output.children());
                return this;
            }

            /**
             * whether there is a map or not $.sample still performs the normal matching
             */


            // we will cache all select elements in case their options are created further down
            var selects = [];
            $.each(data, function(k,v) {

                var selector = '#'+k+',.'+k;
                el = findElement(that,selector);

                if (el.length) {

                    isSimple = !!~'number,string,boolean'.split(',').indexOf(typeof v) || v==='0';// "'0'==false" is true, btw

                    v = isSimple ? v : '';

                    //noinspection FallthroughInSwitchStatementJS
                    switch(true) {
                        case el.is(checkboxTag):
                            checkItem(el,v);
                            break;
                        case el.is('select'): // caching here
                            selects.push({el:el[0],val:v});
                            // we also wish to set the value attribute in case this is rendered to text
                            // as is the case with $.sample(
                            //el.attr('value',v);
                        case el.is(inputTag):
                            el.val(v);
                            break;
                        case el.is(imageTag):
                            el.attr('src',v);
                            break;
                        case el.is(labelTag):
                            el.prepend(v);
                            break;
                        default:
                            el.text(v);
                    }
                }
            });

            /**
             * The map is analized here
             */
            $.each(map, function(map_key,data_key){

                var o = map_key.split('/');
                var prop = o.pop().toLowerCase();
                var sel = o.join('/') || 'this object does not exist';
                var el = findElement(that, sel);

                if (el.length) {
                    var value = data[data_key];
                    switch (prop) {
                        case 'html':
                            el.html(value);
                            break;
                        case 'text':
                        case 'txt':
                            el.text(value);
                            break;
                        case 'value':
                        case 'val':
                            el.val(value);
                            break;
                        case 'checked':
                            checkItem(el,value);
                            break;
                        case 'options': // for select tags
                            // first create the option tags
                            el.empty();
                            $.each(value, function(kk,vv){
                                el.append(
                                    '<option value="' + (vv.value || vv.text || vv) + '">'
                                        + (vv.text || vv.value || vv)
                                    + '</option>')
                            });

                            // check if the default matcher has cached a value

                            $.each(selects, function(k,v){
                                if (v.el===el[0]) {

                                    el.val(v.val);

                                    return false;
                                }
                            });

                            // check to see if there is a map for this value

                            $.each(map, function(k,v) {

                                // this duplicates some code above, I feel wet
                                var o = k.split('/');
                                var prop = o.pop().toLowerCase();
                                var sel = o.join('/') || 'this object does not exist';
                                var el2 = findElement(that, sel);

                                if (el2.length && (prop=='val' || prop=='value') && el[0]===el2[0]) {

                                    el.val(data[v])

                                }

                            });

                            break;
                        default:
                            el.attr(prop,value)

                    }

                }
            });

	    return this;
	}
    };
	$.fn.sample = function(method) {
		// Method calling logic
		if (methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if (!isNaN(method) || typeof method === 'object' || ! method ) {
			return methods.useTmpl.apply( this, arguments );
		} else {
			return methods.useTmpl.apply( this, arguments)
		}
	};
    var oldgSample = $.sample || null;
    $.sample = function (el,data,options) {


        var html = '';
        $(el).wrap('<div/>').parent().sample(data,options).each(function(){
            html+=$(this).html();
        });
        return html;
    };
    $.sample.restore = function(){
        $.sample = oldgSample;
        return oldgSample;
    }
})( jQuery );
