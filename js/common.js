/**************JQUERY FUNCTIONS******************/
jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (( $(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    
    return this;
};

jQuery.fn.inside_center = function () {
    var top = ((this.parent().height() - this.outerHeight()) / 2);
    var left = (( this.parent().width() - this.outerWidth() ) / 2);
    this.parent().css("position","relative");
    this.css("position","absolute");
    this.css("top", top + "px");
    this.css("left", left + "px");
    return this;
};

jQuery.fn.verticalCenter = function(){
    this.each(function() {
        var parent_height = $(this).parent().height();
        var height = $(this).outerHeight();
        
        $(this).removeClass('verticalCenter');
        if(height < parent_height){
            var top_margin = (parent_height - height)/2;
            $(this).css("marginTop",top_margin+'px');
        }
    });
};

jQuery.fn.equalHeights = function(minHeight, maxHeight, callback) {
    if (typeof minHeight !== 'function') {tallest = (minHeight) ? minHeight : 0;}

    this.each(function() {
        if($(this).innerHeight() > tallest) {
                tallest = $(this).innerHeight();
        }
    });
    if((maxHeight) && typeof maxHeight !== 'function' && tallest < maxHeight) tallest = maxHeight;

    this.each(function() {
        padding = $(this).innerHeight() - $(this).height();
        if(padding > 0){$(this).height(tallest-padding);}
        else{$(this).height(tallest);}
        
        if($(this).css('overflow') === 'visible'){
            $(this).css("overflow","auto");
        }
    });

    // Callback function
    if (typeof minHeight === 'function') {
        minHeight();
    }else if (typeof maxHeight === 'function') {
        maxHeight();
    }else if (typeof callback === 'function') {
        callback();
    }
    return true;
};

jQuery.fn.squared = function(){
    this.each(function() {
        var w = $(this).width();
        $(this).height(w);
    });
};

jQuery.fn.reset = function () {
  $(this).each (function() { this.reset(); });
};

jQuery.fn.print = function(){
    var frame_name = ("printer-" + (new Date()).getTime());
    var frame_html = $( "<iframe name='" + frame_name + "'>" );
    frame_html.css({
        "width":"1px",
        "height":"1px",
        "position":"absolute",
        "left":"-9999px"
    }).appendTo( $("body:first"));
    frame = window.frames[ frame_name ];
    var frame_doc = frame.document;
    var style = $( "<div>" ).append($( "style" ).clone());

    frame_doc.open();
    frame_doc.write( "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><html><body><head><title>" );
    frame_doc.write( document.title );
    frame_doc.write( "</title><link href=\"/css/style.css\" rel=\"stylesheet\" type=\"text/css\" />" );
    frame_doc.write( "</head><body><table id=\""+this.attr('id')+"\" class=\""+this.attr('class')+"\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">" );
    frame_doc.write( this.html() );
    frame_doc.write( "</table></body></html>" );
    frame_doc.close();
    frame.focus();
    setTimeout('frame.print()', 1000);

    setTimeout(function(){
        frame_html.remove();
    },(60 * 1000));
};

jQuery.fn.export_excel = function(name,path_export_file){
    $("body:first").append(' <form method="post" lang="es" target="_blank" action="'+path_export_file+'" id="export_excel" style="display:none;"><input name="name" type="hidden" value="" /><input name="data" type="hidden" value="" /></form>');
    $('#export_excel input[name="name"]').val(name);
    $('#export_excel input[name="data"]').val( $("<div>").append( $(this).clone()).html());
    $("#export_excel").submit().remove();
};

jQuery.fn.export_csv = function(name,path_export_file) {
  var data = $(this).first();
  var csvData = [];
  var tmpArr = [];
  var tmpStr = '';
  
  if(_bhl.split('-')[0] === 'es'){var list_delimiter = ';';}
  else{var list_delimiter = ',';}
  
  data.find("tr").each(function() {
      if($(this).find("th").length) {
          tmpArr = [];
          $(this).find("th").each(function() {
            tmpStr = $(this).text().replace(/"/g, '""');
            tmpArr.push('"' + tmpStr + '"');
          });
          csvData.push(tmpArr.join(list_delimiter));
      } else {
          tmpArr = [];
             $(this).find("td").each(function() {
                  if($(this).text().match(/^-{0,1}\d*\.{0,1}\d+$/)) {
                      tmpArr.push(parseFloat($(this).text()));
                  } else {
                      tmpStr = $(this).text().replace(/"/g, '""');
                      tmpArr.push('"' + tmpStr + '"');
                  }
             });
          csvData.push(tmpArr.join(list_delimiter));
      }
  });
  var output = csvData.join('\n');
  var uri = 'data:application/csv;charset=UTF-8,' + encodeURIComponent(output);
  
  
  $("body:first").append('<form method="post" lang="es" target="_blank" action="'+path_export_file+'" id="export_excel" style="display:none;"><input name="name" type="hidden" value="" /><input name="data" type="hidden" value="" /></form>');
    $('#export_excel input[name="name"]').val(name);
    $('#export_excel input[name="data"]').val(output);
    $("#export_excel").submit().remove();
};

var valid = true;
var emailreg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
var msgi = "";
var msgi_c = "INCOMPLETOS:\r\n";
var msgc = "";
var msgc_c = "\r\nINCORRECTOS:\r\n";
var msg = "";

jQuery.fn.Vform = function() {
    $(this).find('.Vtext').each(function(){
        $(this).attr('alt',$(this).val());
    });
    
    $(this).find('.Vnumber').each(function(){
        $(this).attr('alt',$(this).val());
    });
    
    $(this).find('.Vemail').each(function(){
        $(this).attr('alt',$(this).val());
    });
    
    $(this).bind("submit",function(){
        valid = true;
        msgi = "";
        msgc = "";
        msg="";
        var label_present = false;
        var tmp = "";
        var index = 0;
        if($(this).find('input[name=itm_label_in_value]').val() === "1"){
            label_present = true;
        }
        $(this).find('.Vtext').each(function(){
            if($(this).val() === $(this).attr('alt') || $(this).attr('alt') === undefined){
                if($(this).attr('data-Vmsg') !== undefined){
                    msgc = msgc+$(this).attr('name')+": "+$(this).attr('data-Vmsg')+"\r\n";
                }else{
                    msgi = msgi+$(this).attr('name')+": no ha sido completado. \r\n";
                }
                valid = false;
            }
        });
        $(this).find('.Vselect').each(function(){
            if($(this).val() === "0"){
                if($(this).attr('data-Vmsg') !== undefined){
                    msgc = msgc+$(this).attr('name')+": "+$(this).attr('data-Vmsg')+"\r\n";
                }else{
                    msgi = msgi+$(this).attr('name')+": no se ha seleccionado ningún valor. \r\n";
                }
                valid = false;
            }
        });
        $(this).find('.Vemail').each(function(){
            tmp = $(this).val();
            if(label_present === true){
                index = tmp.indexOf(":");
                tmp = tmp.substr(index+1);
                tmp = $.trim(tmp);
            }
            if( !emailreg.test(tmp) ){
                if($(this).attr('data-Vmsg') !== undefined){
                    msgc = msgc+$(this).attr('name')+": "+$(this).attr('data-Vmsg')+"\r\n";
                }else{
                    msgc = msgc+$(this).attr('name')+": no es una dirección de email válida. \r\n";
                }
                valid = false;
            }
        });
        $(this).find('.Vnumber').each(function(){
            tmp = $(this).val();
            if(label_present){
                index = tmp.indexOf(":");
                tmp = tmp.substr(index+1);
                tmp = $.trim(tmp);
            }
            if( isNaN(parseInt(tmp)) || tmp.length === 0){
                if($(this).attr('data-Vmsg') !== undefined){
                    msgc = msgc+$(this).attr('name')+": "+$(this).attr('data-Vmsg')+"\r\n";
                }else{
                    msgc = msgc+$(this).attr('name')+": no es correcto, solo debe contener números. \r\n";
                }
                valid = false;
            }
        });
        

        radio_names = [];
        checkbox_names = [];
        checked = [];
        
        $(this).find('input[class="Vcheck"]').each(function(i,el){
            if(radio_names[$(el).attr('name')] === undefined && checkbox_names[$(el).attr('name')] === undefined){
                if($(el).attr('type') === 'radio'){
                    if($(el).attr('data-Vmsg') !== undefined){
                        radio_names[$(el).attr('name')] = $(el).attr('data-Vmsg');
                    }else{
                        radio_names[$(el).attr('name')] = true;
                    }
                }if($(el).attr('type') === 'checkbox'){
                    if($(el).attr('data-Vmsg') !== undefined){
                        checkbox_names[$(el).attr('name')] = $(el).attr('data-Vmsg');
                    }else{
                        checkbox_names[$(el).attr('name')] = true;
                    }
                }
            }
            if($(el).prop('checked') === true){
                checked[$(el).attr('name')] = true;
            }
        });
        
        for(i in radio_names){
            if(checked[i] === undefined){
                if(radio_names[i] !== true){
                    msgc = msgc+i+": "+radio_names[i]+"\r\n";
                }else{
                    msgc = msgc+i+": no se ha marcado una opción. \r\n";
                }
                valid = false;
            }
        }
        for(i in checkbox_names){
            if(checked[i] === undefined){
                if(checkbox_names[i] !== true){
                    msgc = msgc+i+": "+checkbox_names[i]+"\r\n";
                }else{
                    msgc = msgc+i+": no se ha marcado una opción. \r\n";
                }
                valid = false;
            }
        }       
        
        
        if(msgi.length !== 0){
            msg = msg+msgi_c+msgi;
        }
        if(msgc.length !== 0){
            msg = msg+msgc_c+msgc;
        }
        if(valid === false){
            alert(msg);
            return false;
        }
    });
};

/*******************FUNCTIONS**********************/
function controlViewport(){
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
        var viewportmeta = document.querySelector('meta[name="viewport"]');
        if (viewportmeta) {
            viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
            document.body.addEventListener('gesturestart', function () {
                viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
            }, false);
        }
    }
}

function generate_clock(container){
    var now = new Date();
    container.append('<span class="clock"><span class="h">'+now.getHours()+'</span>:<span class="m">'+now.getMinutes()+'</span>:<span class="s">'+now.getSeconds()+'</span></span>');
    
    if(window['clock_defined'] === undefined || clock_defined !== true){
        window['t'+Math.floor(Math.random() * 2000)] = setInterval("clock()",1000);
        clock_defined = true; 
    }
}

function clock(){
    $('.clock').each(function(){
        var h = parseInt($(this).find('.h').html(),10);
        var m = parseInt($(this).find('.m').html(),10);
        var s = parseInt($(this).find('.s').html(),10);
        
        s++;
        if(s == 60){
            s=0;
            m++;
        }
        if(m == 60){
            m=0;
            h++;
        }
        if(h == 24){
            h=0;
        }
        
        if(s < 10){
            $(this).find('.s').html('0'+s);
        }else{
            $(this).find('.s').html(s);
        }
        if(m < 10){
            $(this).find('.m').html('0'+m);
        }else{
            $(this).find('.m').html(m);
        }
        if(h < 10){
            $(this).find('.h').html('0'+h);
        }else{
            $(this).find('.h').html(h);
        }
    });
}

function full_screen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exit_full_screen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function toggle_full_screen(element){
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
        full_screen(element);
    }else{
        exit_full_screen();
    }
}

function genQuickNav(){
    quick_nav = {};
    quick_nav['Home'] = '/';
    $('.quick-nav').each(function(){
        var a = $(this).find('a');
        a.each(function(){
            if($(this).closest('.submenu').length === 1){quick_nav['- '+$(this).html()] = $(this).attr('href');}
            else{quick_nav[$(this).html()] = $(this).attr('href');}
        });
    });
    return quick_nav;
}

function createQuickNav(target){
    quick_nav = genQuickNav();
    nav_html = '<span id="btn_quick_nav" class="btn mini mdi mdi-menu left hidden d-none d-sm-block" title="Abrir menú de navegación" style="position:fixed;top:0;left:0;z-index:9999;"></span><div id="quick_nav" class="hidden d-none d-sm-block lpadded mobile-lpadded"><h2>Menú de navegación</h2>';
    for(var link in quick_nav){
        if(link.substr(0,2) === '- '){nav_html += '<a href="'+quick_nav[link]+'" class="sub">'+link+'</a>';}
        else{nav_html += '<a href="'+quick_nav[link]+'">'+link+'</a>';}
    }
    nav_html += '</div>';
    target.prepend(nav_html);
}

/**********************TRIGGERS**********************/

$(document).on('click','#btn_quick_nav',function(){
    if($('#quick_nav').is(":visible")){
        $('#quick_nav').hide('fast');
    }else{
        $('#quick_nav').show('fast');
    }
});

$(document).on('click','#quick_nav a',function(){
    $('#quick_nav').hide('fast');
});

$(document).ready(function(){
    $('.Vform').Vform();
});

$(window).on('load',function(){
    $('.equalHeights').equalHeights();
    controlViewport();
    createQuickNav($('body'));
});
