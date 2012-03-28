/**
 * Author: liquidvibr
 * Created using JetBrains PhpStorm
 * Date: 2/12/12
 * Time: 6:29 PM
 */

(function(){

    beforeEach(function(){
        this.addMatchers({
            toEquate: function(expected) {
                return this.actual == expected;
            }
        });
    });

}());