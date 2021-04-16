import $ from 'jquery';

export function setup() {
    console.log('Setup: Cache');

    var cache_List = JSON.parse(
        localStorage.getItem(document.location.origin + `.cache`)
    );
    console.log(cache_List);
}
