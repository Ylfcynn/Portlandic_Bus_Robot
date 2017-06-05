"use strict";


jQuery(document).ready(function() {

    jQuery('.box').on('click', function(event) {
        console.log('It works!');
        // alert('Oh noes, it\'s broken!');

        jQuery(this).css( {
        "background-color": "orange"
      });
    });

});
