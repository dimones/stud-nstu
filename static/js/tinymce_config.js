/**
 * Created by smax on 18.02.17.
 */

tinymce.init({
    selector: '.wysiwyg',
    language_url: '/static/js/langs/ru.js',
    inline: true,
    menubar: false,
    elementpath: false,
    image_advtab: true,
    automatic_uploads: true,
    images_upload_base_path: '/static/img/gallery/',
    plugins: [
      'advlist autolink link image imagetools lists print preview hr',
      'wordcount code fullscreen',
      'save table contextmenu template paste textcolor'
    ],
    toolbar: [
        'insertfile undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image hr | print preview fullpage | forecolor backcolor',
        'save code'
    ],
    paste_data_images: true,

    file_picker_callback: function(callback, value, meta) {
      if (meta.filetype == 'image') {
        $('#upload').trigger('click')
            .on('change', function() {
          var file = this.files[0];
          var reader = new FileReader();
          reader.onload = function(e) {
            callback(e.target.result, {
              alt: ''
            });
          };
          reader.readAsDataURL(file);
        });
      }
    }
});