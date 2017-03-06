(function () {
    function createGalleryLine($parent, $children){
        for(var i=0,j=1; ;i+=2,j+=2){
            if($children[i]===undefined) return;
            if($children[j]===undefined){
                var $el = $(document.createElement('a'));
                $el.addClass('gallery__big-img');
                $el.append($children[i]);
                $el.appendTo($parent);
                delete $children[i];
                continue;
            }

            var $el1 = $(document.createElement('a'));
            var $el2 = $(document.createElement('a'));
            $el1.addClass('gallery__small-img');
            $el2.addClass('gallery__small-img');

            $el1.append($children[i]);
            $el2.append($children[j]);

            var $box = $(document.createElement('div'));
            $box.addClass('gallery__img-box');
            $box.append($el1);
            $box.append($el2);

            $box.appendTo($parent);
            delete $children[i];
            delete $children[j];
        }
    }

    var $images = $('.gallery__img');
    var $wrapper = $('.gallery-content');

    $images.detach();
    console.log("1");

    while ($images.length > 0){
        var $insert = $images.splice(0,7);
        createGalleryLine($wrapper, $insert);
    }
})();