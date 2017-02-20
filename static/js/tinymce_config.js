/**
 * Created by smax on 18.02.17.
 */

tinymce.init({
    selector: 'textarea.wysiwyg',
    width: 800,
    height: 400,
    language_url: '/static/js/langs/ru.js',
    menubar: false,
    elementpath: false,
    image_advtab: true,
    plugins: [
      'advlist autolink link image imagetools lists print preview hr',
      'searchreplace wordcount code fullscreen',
      'save table contextmenu template paste textcolor'
    ],
    toolbar: [
        'fullscreen | insertfile undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image hr | print preview fullpage | forecolor backcolor | searchreplace',
        'save code'
    ],
    paste_data_images: true,

    file_picker_callback: function(callback, value, meta) {
      if (meta.filetype == 'image') {
        $('#upload').trigger('click');
        $('#upload').on('change', function() {
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
    },
    templates: [{
      title: 'Test template 1',
      content: 'Test 1'
    }, {
      title: 'Test template 2',
      content: 'Test 2'
    }]
});