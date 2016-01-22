/************************
*************************
    Mobile Menu v1.0
    (c) 2015 George Lieu
    Edited by: Sameer Shemna
    licensed under MIT
************************
************************/

;(function($) {
    'use strict';    
    $.fn.mobileMenu = function(options) {        
        var defaults = {
            MenuWidth    : 250,
            SlideSpeed    : 300,
            WindowsMaxWidth : 767,
            PagePush     : true,
            FromLeft     : true,
            Overlay  : true,
            CollapseMenu : true,
            ClassName : "mobile-menu"
        };        
        return this.each(function() {
            var config = $.extend({}, defaults, options);            
            var self = $(this);
            var overlay = $('#overlay'), body = $('body'), page = $('#page'), isOpen = false, expandOneHasOpened = false, expandTowHasOpened = false;
            var expandheight = 0, mmCssClass = "";
            mmInit();
            $('.mm-toggle').click(function() {
                self.css('height', $(document).height());
                if (config.Overlay == true) {
                    overlay.css('height', $(document).height());
                }                
                !isOpen ? mmOpen() : mmClose();
            });            
            function mmInit (){
                if (config.FromLeft == true) {
                    self.css('left', -(config.MenuWidth));
                } else {
                    self.css('right', -(config.MenuWidth));
                }
                self.find('ul:first').addClass(config.ClassName);
                mmCssClass = config.ClassName;
                
                self.css('width', config.MenuWidth);
                self.find('.'+mmCssClass+' ul').css('display', 'none');
                var expandLink = '<span class=\"expand fa fa-plus\"></span>';
                self.find('li>ul').each(function(index){
                    var ul = $( this );
                    if ((typeof(ul.parent().html()) !== 'undefined') && (ul.parent().html().indexOf( expandLink ) === -1)){
                        ul.parent().prepend( expandLink );
                    }
                });

                //$('.'+mmCssClass).append('<li style="height: 30px;"></li>');
                $('.'+mmCssClass+' li:has(span)').each(function(i){
                    $(this).find('a:first').css('padding-right', 55);
                });
            }               
            function getMmHeight() {
                var totalHeight = 0;  
                var docHeight = $(document).height();
                self.find('.'+mmCssClass+' > li').each(function(i){
                    var mmItemHeight = $(this).height();
                    totalHeight += mmItemHeight;
                });
                if (docHeight >= totalHeight ) {
                    totalHeight = docHeight;
                }
                /*SHS to allow scroll*/
                totalHeight = $(document).height();
                return totalHeight;
            }             
            function getMmItemHeight(nn) {
                expandheight = $('.'+mmCssClass+' span.expand').height();
                if (nn === 1) { 
                    self.find('.'+mmCssClass+' > li:has(span)').each(function(i){
                        var mmItemHeight = $(this).height();
                        var topPadding = (mmItemHeight-expandheight)/2;
                        $(this).find('span.expand').css({'padding-bottom': topPadding, 'padding-top': topPadding});
                    });    
                }
                if (nn === 2) {  
                    self.find('.'+mmCssClass+' > li > ul > li:has(span)').each(function(i){
                        var mmItemHeight = $(this).height();
                        var topPadding = (mmItemHeight-expandheight)/2;
                        $(this).find('span.expand').css({'padding-bottom': topPadding, 'padding-top': topPadding});
                    });    
                }        
            }            
            function mmOpen() {
                body.addClass('mmPushBody');                
                if (config.Overlay == true) {
                    overlay.addClass('mmOverlay');
                } else {
                    overlay.addClass('mmOverlay').css('opacity', 0);
                }                        
                //self.css({display : 'block', overflow : 'hidden'});
                self.css({display : 'block', overflow : 'auto'});
                if (config.FromLeft == true) {
                    if (config.PagePush == true) {
                        page.animate({ left: config.MenuWidth }, config.SlideSpeed, 'linear');
                    }                
                    self.animate({ left: "0" }, config.SlideSpeed, 'linear', function() {
                        self.css('height', getMmHeight());
                        isOpen = true;
                    });
                } else {
                    if (config.PagePush == true) {
                        page.animate({ left: -(config.MenuWidth) }, config.SlideSpeed, 'linear');
                    }                
                    self.animate({ right: "0" }, config.SlideSpeed, 'linear', function() {
                        self.css('height', getMmHeight());
                        isOpen = true;
                    });
                }                 
                if(!expandOneHasOpened) {
                    getMmItemHeight(1);
                    expandOneHasOpened = true;
                }                
            }
            function mmClose() {                
                if (config.FromLeft == true) {
                    if (config.PagePush == true) {
                        page.animate({ left: "0" }, config.SlideSpeed, 'linear');
                    }                
                    self.animate({ left: -(config.MenuWidth) }, config.SlideSpeed, 'linear', function() {
                        body.removeClass('mmPushBody');
                        overlay.css('height', 0).removeClass('mmOverlay');
                        self.css('display', 'none');            
                        isOpen = false;
                    });
                } else {
                    if (config.PagePush == true) {
                        page.animate({ left: "0" }, config.SlideSpeed, 'linear');
                    }                
                    self.animate({ right: -(config.MenuWidth) }, config.SlideSpeed, 'linear', function() {
                        body.removeClass('mmPushBody');
                        overlay.css('height', 0).removeClass('mmOverlay');
                        self.css('display', 'none');            
                        isOpen = false;
                    });                    
                }                
            }
            $(window).resize(function() {
                if ($(window).width() >= config.WindowsMaxWidth && isOpen) { 
                    if (self.css('left') != -(config.MenuWidth)) {
                        mmClose();
                    }
                }
            });
            // second level menu
            $('.'+mmCssClass+' > li > span.expand').click(function() {
                if (config.CollapseMenu == true) {
                    var secondLevelSpan = $('.'+mmCssClass+' li span');
                    if (secondLevelSpan.hasClass('open') && $(this).next().next().css('display') === 'none') {   
                        $( '.'+mmCssClass+' li ul' ).slideUp();            
                        if( secondLevelSpan.hasClass('open' )) {
                            secondLevelSpan.removeClass('fa-minus').addClass('fa-plus');
                        } else {
                            secondLevelSpan.removeClass('fa-plus').addClass('fa-minus');
                        }
                        secondLevelSpan.removeClass('open');
                    } 
                }
                $(this).nextAll('.'+mmCssClass+' ul').slideToggle(function(){
                    if (config.CollapseMenu == true) {
                        $(this).promise().done(function(){ 
                            self.css('height', getMmHeight());
                        });
                    } else {
                        self.css('height', getMmHeight());
                    }
                });        
                if( $( this ).hasClass('fa-plus' )) {
                    $( this ).removeClass('fa-plus').addClass('fa-minus');
                } else {
                    $( this ).removeClass('fa-minus').addClass('fa-plus');
                }
                $(this).toggleClass('open'); 
                if(!expandTowHasOpened) {
                    getMmItemHeight(2);
                    expandTowHasOpened = true;
                }
            });
            // third level menu
            $('.'+mmCssClass+' > li > ul > li > span.expand').click(function() {
                if (config.CollapseMenu == true) {
                    var thirdLevelSpan = $('.'+mmCssClass+' li ul li span');
                    if (thirdLevelSpan.hasClass('open') && $(this).next().next().css('display') === 'none') {
                        $('.'+mmCssClass+' li ul ul').slideUp();            
                        if( thirdLevelSpan.hasClass('open')) {
                            thirdLevelSpan.removeClass('fa-minus').addClass('fa-plus');
                        } else {
                            thirdLevelSpan.removeClass('fa-plus').addClass('fa-minus');
                        }
                        thirdLevelSpan.removeClass('open');
                    }
                }
                $(this).nextAll('.'+mmCssClass+' ul ul').slideToggle(function(){                    
                    if (config.CollapseMenu == true) {
                        $(this).promise().done(function(){
                            self.css('height', getMmHeight());
                        });
                    } else {
                        self.css('height', getMmHeight());
                    }
                });
                if( $( this ).hasClass('fa-plus' )) {
                    $( this ).removeClass('fa-plus').addClass('fa-minus');
                } else {
                    $( this ).removeClass('fa-minus').addClass('fa-plus');
                }
                $(this).toggleClass('open');         
            });    

            $('.'+mmCssClass+' li a').click(function() {
                $('.'+mmCssClass+' li a').removeClass('active');
                $(this).addClass('active');
                mmClose();
            });
            
            overlay.click(function(){
                 mmClose();
            });

            $('.'+mmCssClass+' li a.active').parent().children('.expand').removeClass('fa-plus').addClass('fa-minus open');
            $('.'+mmCssClass+' li a.active').parent().children('ul').css('display', 'block');
        });
    };    
})(jQuery);
