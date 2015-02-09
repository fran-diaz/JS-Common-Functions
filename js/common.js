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
