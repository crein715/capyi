(function () {
    'use strict';

    function startPlugin() {
        if (window.uaserials_test) return;
        window.uaserials_test = true;

        // Додаємо кнопку на сторінку фільму
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var btn = $('<div class="full-start__button selector view--uaserials" data-subtitle="UASerials">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width:1.3em;height:1.3em">' +
                    '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m0 2v12h16V6H4m2 2h2v2H6V8m4 0h8v2h-8V8m-4 4h2v2H6v-2m4 0h8v2h-8v-2"/>' +
                    '</svg>' +
                    '<span>UASerials</span>' +
                    '</div>');

                btn.on('hover:enter', function () {
                    Lampa.Noty.show('UASerials працює! 🎉');
                });

                e.object.activity.render().find('.view--torrent').after(btn);
            }
        });

        console.log('UASerials test plugin loaded!');
    }

    if (window.appready) startPlugin();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') startPlugin();
        });
    }
})();
