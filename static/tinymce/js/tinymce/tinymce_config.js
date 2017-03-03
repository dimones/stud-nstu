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
      'save table contextmenu template paste textcolor responsivefilemanager'
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
    content_css : 'static/css/Accordion.css',
    style_formats: [
        {title: 'accordion-panel', inline: 'div', classes:'accordion__panel'},
        {title: 'accordion-button', inline: 'button', classes:'accordion__button'},
        {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
        {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
        {title: 'Example 1', inline: 'span', classes: 'example1'},
        {title: 'Example 2', inline: 'span', classes: 'example2'},
        {title: 'Table styles'},
        {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
      ]
});