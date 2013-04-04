// iOS CSS detection
// usefull for install webapp button

var html        = document.getElementsByTagName('html')[0];
var classes     = html.className;

//alert(navigator.userAgent == 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31');

if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
    classes = classes + ' iOS';
}

if(!!window.navigator.standalone) {
    classes = classes + ' isStandalone';
}

html.className = classes;