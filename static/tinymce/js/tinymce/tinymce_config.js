/**
 * Created by smax on 18.02.17.
 */

tinymce.init({
    selector: '.wysiwyg',
    language_url: '/static/tinymce/js/tinymce/langs/ru.js',
    elementpath: false,
    automatic_uploads: true,
    images_upload_url: 'postAcceptor.py',
    images_upload_base_path: '/',
    images_upload_credentials: false,
    plugins: [
      'advlist autolink link lists preview hr',
      'wordcount code fullscreen',
      'save table contextmenu paste visualblocks'
    ],
    toolbar: [
        'newdocument undo redo pastetext | styleselect removeformat | bold italic underline strikethrough | ' +
        'bullist numlist outdent indent | link hr | preview fullpage |',
        'save code'
    ],
    invalid_elements : 'script',
    content_css : 'static/css/wysiwyg.css',
    end_container_on_empty_block: true,
    visualblocks_default_state: true,
    style_formats_autohide:true,
    style_formats: [
        {
            title: 'Тело подраздела',
            block: 'div',
            classes:'accordion__panel',
            wrapper: true,
            merge_siblings: true,
            exact: false
        },
        {
            title: 'Заголовок подраздела',
            block: 'div',
            classes:'accordion__button',
            exact: false,
            wrapper: false
        },
        {
            title: 'Параграф',
            block: 'p'
        },
        {
            title: 'Внимание',
            block: 'p',
            classes: 'attention'
        }
      ],
//     setup: function(editor) {
//        var className = /accordion__button/i;
//        editor.on('click', function(e){
//            if(e.toElement.className.search(className) !== -1){
//                e.toElement.classList.toggle("active");
//                var panel = e.toElement.nextElementSibling;
//                if (panel.style.maxHeight){
//                  panel.style.maxHeight = null;
//                } else {
//                  panel.style.maxHeight = panel.scrollHeight + "px";
//                }
//            }
//        });
//
//      }
});