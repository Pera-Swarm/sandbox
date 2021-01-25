import $ from 'jquery';

// Common to all pages
var channel = 'v1';

$(document).ready(function () {
    includeHTML();
    window.$ = $;

    $('.channel').text(channel);

    // Disable all buttons by default
    $('.btn').prop('disabled', true);
});

function includeHTML() {
    const includes = document.getElementsByTagName('include');
    [].forEach.call(includes, (include) => {
        let filePath = include.getAttribute('src');
        fetch(filePath).then((file) => {
            file.text().then((content) => {
                include.insertAdjacentHTML('afterend', content);
                include.remove();
            });
        });
    });
}
