function addElements() {
    var parent = $('.thumbnails');
    var elements = parent.find('li');
    elements.each(function(index, object) {
        var elem = $(object).clone(true);
        parent.append(elem);
    })
}
function watch(selector) {
    console.log('watching for element', selector);


    _.delay(addElements, 4000);


    console.log('watching for elements', elements);
}
