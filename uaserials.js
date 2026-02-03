(function () {
    'use strict';

    var network = new Lampa.Reguest();
    var MAIN_URL = 'https://uaserials.com';
    var PROXY = 'https://corsproxy.io/?';

    function proxyUrl(url) {
        return PROXY + encodeURIComponent(url);
    }

    function startPlugin() {
        if (window.uaserials_ready) return;
        window.uaserials_ready = true;

        Lampa.Component.add('uaserials', component);

        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var btn = $('<div class="full-start__button selector view--uaserials" data-subtitle="UASerials"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width:1.3em;height:1.3em"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m0 2v12h16V6H4m2 2h2v2H6V8m4 0h8v2h-8V8m-4 4h2v2H6v-2m4 0h8v2h-8v-2"/></svg><span>UASerials</span></div>');

                btn.on('hover:enter', function () {
                    var movie = e.data.movie;
                    var title = movie.title || movie.name;
                    
                    Lampa.Activity.push({
                        url: '',
                        title: 'UASerials',
                        component: 'uaserials',
                        search: title,
                        search_original: movie.original_title || movie.original_name,
                        movie: movie,
                        page: 1
                    });
                });

                e.object.activity.render().find('.view--torrent').after(btn);
            }
        });
    }

    function component(object) {
        var scroll = new Lampa.Scroll({mask: true, over: true});
        var items = [];
        var html = $('<div></div>');
        var body = $('<div class="category-full"></div>');
        var last;

        this.create = function () {
            this.activity.loader(true);
            html.append(body);
            scroll.append(html);
            this.search();
        };

        this.search = function () {
            var _this = this;
            var query = object.search;

            network.clear();
            network.timeout(20000);

            var url = MAIN_URL + '/?do=search&subaction=search&story=' + encodeURIComponent(query);

            network.silent(proxyUrl(url), function (str) {
                _this.parseSearch(str);
            }, function (a, c) {
                Lampa.Noty.show('Помилка завантаження');
                _this.empty();
            }, false, {dataType: 'text'});
        };

        this.parseSearch = function (str) {
            var _this = this;
            var parser = new DOMParser();
            var doc = parser.parseFromString(str, 'text/html');
            var results = doc.querySelectorAll('.short-item');

            items = [];

            results.forEach(function (item) {
                var link = item.querySelector('a');
                var title = item.querySelector('.th-title, .short-title');
                var img = item.querySelector('img');

                if (link && title) {
                    var href = link.getAttribute('href');
                    if (href && !href.startsWith('http')) {
                        href = MAIN_URL + href;
                    }
                    items.push({
                        title: title.textContent.trim(),
                        url: href,
                        img: img ? (img.getAttribute('data-src') || img.getAttribute('src')) : ''
                    });
                }
            });

            if (items.length) {
                this.buildList();
            } else {
                this.empty();
            }
        };

        this.buildList = function () {
            var _this = this;
            body.empty();

            items.forEach(function (item) {
                var card = Lampa.Template.get('card', {
                    title: item.title,
                    release_year: ''
                });

                var imgUrl = item.img;
                if (imgUrl && !imgUrl.startsWith('http')) {
                    imgUrl = MAIN_URL + imgUrl;
                }

                card.find('.card__img').attr('src', imgUrl || './img/img_broken.svg').on('error', function(){
                    $(this).attr('src', './img/img_broken.svg');
                });

                card.addClass('selector');

                card.on('hover:enter', function () {
                    _this.loadDetails(item);
                });

                body.append(card);
                if (!last) last = card;
            });

            this.activity.loader(false);
            this.activity.toggle();
        };

        this.loadDetails = function (item) {
            var _this = this;
            
            Lampa.Modal.open({
                title: '',
                html: $('<div class="broadcast__text" style="padding:1.5em">Завантаження...</div>'),
                onBack: function () {
                    Lampa.Modal.close();
                    Lampa.Controller.toggle('content');
                }
            });

            network.clear();
            network.timeout(20000);

            network.silent(proxyUrl(item.url), function (str) {
                Lampa.Modal.close();
                _this.parseDetails(str, item);
            }, function () {
                Lampa.Modal.close();
                Lampa.Noty.show('Помилка завантаження');
                Lampa.Controller.toggle('content');
            }, false, {dataType: 'text'});
        };

        this.parseDetails = function (str, item) {
            var _this = this;
            var parser = new DOMParser();
            var doc = parser.parseFromString(str, 'text/html');
            var playerControl = doc.querySelector('player-control');

            if (!playerControl) {
                Lampa.Noty.show('Плеєр не знайдено');
                Lampa.Controller.toggle('content');
                return;
            }

            var dataTag = playerControl.getAttribute('data-tag1');
            if (!dataTag) {
                Lampa.Noty.show('Дані плеєра не знайдено');
                Lampa.Controller.toggle('content');
                return;
            }

            try {
                var encrypted = JSON.parse(dataTag);
                _this.decrypt(encrypted, item);
            } catch (e) {
                Lampa.Noty.show('Помилка парсингу');
                Lampa.Controller.toggle('content');
            }
        };

        this.decrypt = function (data, item) {
            var _this = this;
            var AES_KEY = '297796CCB81D2551';

            function hexToBytes(hex) {
                var bytes = [];
                for (var i = 0; i < hex.length; i += 2) {
                    bytes.push(parseInt(hex.substr(i, 2), 16));
                }
                return new Uint8Array(bytes);
            }

            try {
                var salt = hexToBytes(data.salt);
                var iv = hexToBytes(data.iv);
                var ct = Uint8Array.from(atob(data.ciphertext), function(c) { return c.charCodeAt(0); });
                var iterations = data.iterations || 999;

                crypto.subtle.importKey('raw', new TextEncoder().encode(AES_KEY), 'PBKDF2', false, ['deriveKey'])
                .then(function(key) {
                    return crypto.subtle.deriveKey(
                        {name: 'PBKDF2', salt: salt, iterations: iterations, hash: 'SHA-512'},
                        key,
                        {name: 'AES-CBC', length: 256},
                        false,
                        ['decrypt']
                    );
                })
                .then(function(key) {
                    return crypto.subtle.decrypt({name: 'AES-CBC', iv: iv}, key, ct);
                })
                .then(function(dec) {
                    var result = new TextDecoder().decode(dec);
                    result = result.replace(/\0+$/, '').trim();
                    var idx = result.lastIndexOf(']');
                    if (idx > 0) result = result.substring(0, idx + 1);
                    result = result.replace(/\\/g, '');
                    
                    var json = JSON.parse(result);
                    _this.showPlayer(json, item);
                })
                .catch(function(e) {
                    Lampa.Noty.show('Помилка розшифрування');
                    Lampa.Controller.toggle('content');
                });
            } catch (e) {
                Lampa.Noty.show('Помилка');
                Lampa.Controller.toggle('content');
            }
        };

        this.showPlayer = function (data, item) {
            var _this = this;
            
            if (!data || !data.length) {
                Lampa.Noty.show('Немає даних');
                Lampa.Controller.toggle('content');
                return;
            }

            var info = data[0];
            
            if (info.seasons && info.seasons.length) {
                var select_items = [];
                
                info.seasons.forEach(function(season, si) {
                    season.episodes.forEach(function(ep, ei) {
                        ep.sounds.forEach(function(sound) {
                            select_items.push({
                                title: (season.title || 'Сезон ' + (si+1)) + ' / ' + (ep.title || 'Серія ' + (ei+1)) + ' / ' + sound.title,
                                url: sound.url
                            });
                        });
                    });
                });

                Lampa.Select.show({
                    title: item.title,
                    items: select_items,
                    onSelect: function (a) {
                        _this.play(a, item);
                    },
                    onBack: function () {
                        Lampa.Controller.toggle('content');
                    }
                });
            } else if (info.url) {
                this.play({url: info.url, title: item.title}, item);
            } else {
                Lampa.Noty.show('Немає відео');
                Lampa.Controller.toggle('content');
            }
        };

        this.play = function (a, item) {
            network.clear();
            network.timeout(20000);

            network.silent(proxyUrl(a.url), function (str) {
                var m = str.match(/file\s*:\s*["']([^"']+)["']/);
                
                if (m && m[1]) {
                    var url = m[1];
                    
                    if (!url.startsWith('http')) {
                        try {
                            var decoded = atob(url.replace(/=+$/, ''));
                            url = decoded.split('').reverse().join('');
                        } catch(e) {}
                    }

                    if (url && url.startsWith('http')) {
                        Lampa.Player.play({
                            title: item.title + ' - ' + a.title,
                            url: url
                        });
                        
                        Lampa.Player.playlist([{
                            title: item.title + ' - ' + a.title,
                            url: url
                        }]);
                    } else {
                        Lampa.Noty.show('Невірний URL відео');
                        Lampa.Controller.toggle('content');
                    }
                } else {
                    Lampa.Noty.show('Відео не знайдено');
                    Lampa.Controller.toggle('content');
                }
            }, function () {
                Lampa.Noty.show('Помилка завантаження відео');
                Lampa.Controller.toggle('content');
            }, false, {dataType: 'text'});
        };

        this.empty = function () {
            var empty = Lampa.Template.get('list_empty');
            body.append(empty);
            this.activity.loader(false);
            this.activity.toggle();
        };

        this.start = function () {
            if (Lampa.Activity.active().activity !== this.activity) return;
            if (last) last.trigger('hover:focus');
        };

        this.pause = function () {};
        this.stop = function () {};
        this.render = function () { return scroll.render(); };
        
        this.destroy = function () {
            network.clear();
            scroll.destroy();
        };
    }

    if (window.appready) startPlugin();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') startPlugin();
        });
    }
})();
