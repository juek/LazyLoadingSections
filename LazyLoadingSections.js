/*
########################################################################
JavaScript user runtime for Typesetter CMS Addon 'Lazy Loading Sections'
Author: J. Krausz
Date: 2017-11-22
Version 1.0-b2
########################################################################
*/

var LazyLoadingSections = {

  debug : false,

  init  : function(){
    $(window).on("load resize scroll", LazyLoadingSections.eventThrottle.handleEvents );
    $(window).on("throttled:load throttled:resize throttled:scroll", function(e){
      if( LazyLoadingSections.debug ){ 
        console.log(e.type); 
      }
      $('.lazy-section-placeholder:not(.lazy-section-updating)').each(function(){
        var $this = $(this);
        if( !$this.visible(true) ){
          if( LazyLoadingSections.debug ){ 
            console.log('not visible: ', $this); 
          }
          return;
        }
        var url = $this.attr('data-lazy-url');
        if( !url ){
          return;
        }
        $this.addClass('lazy-section-updating');
        $this.find('i.fa')
          .removeClass('fa-ellipsis-h')
          .addClass('fa-spinner fa-spin fa-step');

        url = $gp.jPrep(url);
        setTimeout(function(){
          $.getJSON(url, function(data, textStatus, jqXHR){
            if( LazyLoadingSections.debug ){ 
              console.log('AJAX response data = ', data); 
            }
            LazyLoadingSections.animateReplace(url, data, textStatus, jqXHR);
          });
        }, 150);

      });
    });
  },


  animateReplace : function(url, data, textStatus, jqXHR){
    if( typeof(data) != 'object' ){
      if( LazyLoadingSections.debug ){ 
        console.log('data is ' + typeof(data) + ', object(array) expected'); 
      }
      return;
    }
    if( !data[0].SELECTOR ){
      if( LazyLoadingSections.debug ){ 
        console.log('data[0].SELECTOR is ' + data[0].SELECTOR + ', css selector expected'); 
      }
      return;
    }
    if( !$(data[0].SELECTOR).length ){
      if( LazyLoadingSections.debug ){ 
        console.log('$(' + data[0].SELECTOR + ') element does not exist in the DOM'); 
      }
      return;
    }

    var $section = $(data[0].SELECTOR).closest('.GPAREA');

    var preset_style = {
      width     : $section[0].style.width,
      height    : $section[0].style.height,
      overflow  : $section[0].style.overflow,
      opacity   : $section[0].style.opacity
    };

    var old_css = {
      // width/height: we expect border-box model, therefore we use outerWidth/outerHeight
      'width'     : $section.outerWidth()  + 'px', 
      'height'    : $section.outerHeight() + 'px', 
      'opacity'   : 0,
      'overflow'  : 'hidden'
    }

    // replace the content
    $gp.Response.call(url, data, textStatus, jqXHR)

    var new_css = {
      'width'   : $section.outerWidth()  + 'px',
      'height'  : $section.outerHeight() + 'px',
      'opacity' : $section.css('opacity')
    }

    if( LazyLoadingSections.debug ){ 
      console.log('old_css = ', old_css);
      console.log('new_css = ', new_css);
    }

    $section
      .css(old_css)
      .animate(new_css, 400, 'swing', function(){
        // restore possible preset inline styles
        $section[0].style.width = preset_style.width;
        $section[0].style.height = preset_style.height;
        $section[0].style.opacity = preset_style.opacity;
        $section[0].style.overflow = preset_style.overflow || 'visible';
        // fire some events if new content requires them to adapt to the context
        $(window).resize().scroll();
      });

  },


  eventThrottle : {
    last          : null,
    deferTimer    : null,
    thottle       : 250,  // time in ms, 250 = 4 times/second
    handleEvents  : function(e){
      var event_type = e.type;
      var now = +new Date;
      if ( LazyLoadingSections.eventThrottle.last && now < LazyLoadingSections.eventThrottle.last + LazyLoadingSections.eventThrottle.thottle ){
        clearTimeout(LazyLoadingSections.eventThrottle.deferTimer);
        LazyLoadingSections.eventThrottle.deferTimer = setTimeout( function(event_type){
          LazyLoadingSections.eventThrottle.last = now;
          $(window).trigger('throttled:' + event_type);
        }, LazyLoadingSections.eventThrottle.thottle);
      }else{
        LazyLoadingSections.eventThrottle.last = now;
        $(window).trigger('throttled:' + event_type);
      }
    }
  }

};



/* ######################### */
/* ######## I N I T ######## */
/* ######################### */

$(function(){
  if( !isadmin ){
    LazyLoadingSections.init();
  }
});


/* LazyLoadingSections.js -- END */
