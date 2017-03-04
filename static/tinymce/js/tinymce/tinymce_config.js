/**
 * Created by smax on 18.02.17.
 */

tinymce.init({
    selector: '.wysiwyg',
    language_url: '/static/tinymce/js/tinymce/langs/ru.js',
    elementpath: false,
    image_advtab: true,
    automatic_uploads: true,
    images_upload_url: 'postAcceptor.py',
    images_upload_base_path: '/',
    images_upload_credentials: false,
    plugins: [
      'advlist autolink link image imagetools lists print preview hr',
      'wordcount code fullscreen filemanager',
      'save table contextmenu template paste textcolor responsivefilemanager visualblocks'
    ],
    toolbar: [
        'insertfile undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image responsivefilemanager hr | print preview fullpage | forecolor backcolor',
        'save code'
    ],
    paste_data_images: true,
    external_filemanager_path:"../../filemanager/",
    filemanager_title:"Responsive Filemanager" ,
    external_plugins: { "filemanager" : "../../filemanager/plugin.min.js"},
    invalid_elements : 'script',
    content_css : 'static/css/allstyles.css',
  end_container_on_empty_block: true,
  visualblocks_default_state: true,
    style_formats: [
        {
            title: 'accordion-panel',
            block: 'div',
            classes:'accordion__panel',
            wrapper: true,
            merge_siblings: true,
            exact: true
        },
        {
            title: 'accordion-button',
            block: 'div',
            classes:'accordion__button',
            wrapper: false
        },
        {
            title: 'paragraf',
            block: 'p'
        }
      ],
     setup: function(editor) {
        var className = /accordion__button/i;
        editor.on('click', function(e){
            if(e.toElement.className.search(className) !== -1){
                e.toElement.classList.toggle("active");
                var panel = e.toElement.nextElementSibling;
                if (panel.style.maxHeight){
                  panel.style.maxHeight = null;
                } else {
                  panel.style.maxHeight = panel.scrollHeight + "px";
                }
            }
        });

      }
});