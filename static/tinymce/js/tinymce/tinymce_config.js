/**
 * Created by smax on 18.02.17.
 */

tinymce.init({
    selector: '.wysiwyg',
    language_url: '/static/tinymce/js/tinymce/langs/ru.js',
    menubar: false,
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
    external_plugins: { "filemanager" : "../../filemanager/plugin.min.js"}
});