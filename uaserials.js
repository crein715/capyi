(function () {
    'use strict';

    var network = new Lampa.Reguest();
    var MAIN_URL = 'https://uaserials.com';
    var PROXY = 'https://corsproxy.io/?';
    var AES_KEY = '297796CCB81D25512';

    var source_titles = {
        uaserials: 'UASerials'
    };

    function proxyUrl(url) {
        return PROXY + encodeURIComponent(url);
    }

    function hexToWordArray(hex) {
        var words = [];
        for (var i = 0; i < hex.length; i += 8) {
            words.push(parseInt(hex.substr(i, 8), 16));
        }
        return CryptoJS.lib.WordArray.create(words, hex.length / 2);
    }

    function decryptData(data) {
        try {
            var salt = CryptoJS.enc.Hex.parse(data.salt);
            var iv = CryptoJS.enc.Hex.parse(data.iv);
            var iterations = data.iterations || 999;

            var key = CryptoJS.PBKDF2(AES_KEY, salt, {
                keySize: 256 / 32,
                iterations: iterations,
                hasher: CryptoJS.algo.SHA512
            });

            var decrypted = CryptoJS.AES.decrypt(data.ciphertext, key, { iv: iv });

            var result = decrypted.toString(CryptoJS.enc.Utf8);
            result = result.replace(/\0+$/, '').trim();
            var idx = result.lastIndexOf(']');
            if (idx > 0) result = result.substring(0, idx + 1);
            result = result.replace(/\\/g, '');
            
            return JSON.parse(result);
        } catch (e) {
            console.error('UASerials decrypt error:', e);
            return null;
        }
    }

    function createSource() {
        return function uaserialsSource(component, _object) {
            var object = _object;
            var select_title = '';
            var filter_items = {
                season: [],
                voice: []
            };
            var choice = {
                season: 0,
                voice: 0,
                voice_name: ''
            };
            var results_cache = [];
            var player_data = null;

            this.searchByTitle = function (_object, title) {
                object = _object;
                search({ title: title });
            };

            this.searchByImdbID = function (_object, imdb_id) {
                object = _object;
                search({ title: object.movie.title || object.movie.name });
            };

            this.searchByKinopoiskID = function (_object, kp_id) {
                object = _object;
                search({ title: object.movie.title || object.movie.name });
            };

            function search(params) {
                var query = params.title || '';
                var url = MAIN_URL + '/?do=search&subaction=search&story=' + encodeURIComponent(query);

                network.clear();
                network.timeout(20000);
                network.silent(proxyUrl(url), function (str) {
                    parseSearchResults(str);
                }, function () {
                    component.emptyForBalanser('uaserials');
                }, false, { dataType: 'text' });
            }

            function parseSearchResults(str) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(str, 'text/html');
                var items = doc.querySelectorAll('.short-item');

                results_cache = [];

                items.forEach(function (item) {
                    var link = item.querySelector('a');
                    var title = item.querySelector('.th-title, .short-title');
                    var img = item.querySelector('img');

                    if (link && title) {
                        var href = link.getAttribute('href');
                        if (href && !href.startsWith('http')) {
                            href = MAIN_URL + href;
                        }
                        results_cache.push({
                            title: title.textContent.trim(),
                            url: href,
                            img: img ? (img.getAttribute('data-src') || img.getAttribute('src')) : ''
                        });
                    }
                });

                if (results_cache.length) {
                    showResults();
                } else {
                    component.emptyForBalanser('uaserials');
                }
            }

            function showResults() {
                var items = results_cache.map(function (item) {
                    return {
                        title: item.title,
                        quality: '',
                        info: '',
                        url: item.url,
                        img: item.img
                    };
                });
                component.reset();
                component.showResults(items, {
                    onSelect: function (a) {
                        loadDetails(a);
                    }
                });
            }

            function loadDetails(item) {
                component.loading(true);

                network.clear();
                network.timeout(20000);
                network.silent(proxyUrl(item.url), function (str) {
                    parseDetails(str, item);
                }, function () {
                    component.loading(false);
                    Lampa.Noty.show('Помилка завантаження');
                }, false, { dataType: 'text' });
            }

            function parseDetails(str, item) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(str, 'text/html');

                var playerControl = doc.querySelector('player-control') || doc.querySelector('[data-tag1]');

                if (!playerControl) {
                    component.loading(false);
                    Lampa.Noty.show('Плеєр не знайдено');
                    return;
                }

                var dataTag = playerControl.getAttribute('data-tag1');
                if (!dataTag) {
                    component.loading(false);
                    Lampa.Noty.show('Дані плеєра не знайдено');
                    return;
                }

                var encrypted;
                try {
                    encrypted = JSON.parse(dataTag);
                } catch (e) {
                    component.loading(false);
                    Lampa.Noty.show('Невірний формат даних');
                    return;
                }

                select_title = item.title;
                var decrypted = decryptData(encrypted);

                if (!decrypted) {
                    component.loading(false);
                    Lampa.Noty.show('Помилка розшифрування');
                    return;
                }

                player_data = decrypted;
                component.loading(false);
                processPlayerData(decrypted, item);
            }

            function processPlayerData(data, item) {
                if (!data || !data.length) {
                    Lampa.Noty.show('Порожні дані');
                    return;
                }

                var info = data[0];

                if (info.seasons && info.seasons.length) {
                    filter_items.season = info.seasons.map(function (s, i) {
                        return { title: s.title || 'Сезон ' + (i + 1), index: i };
                    });
                    
                    var voices = [];
                    if (info.seasons[0] && info.seasons[0].episodes && info.seasons[0].episodes[0]) {
                        var ep = info.seasons[0].episodes[0];
                        if (ep.sounds) {
                            ep.sounds.forEach(function (s, i) {
                                voices.push({ title: s.title || 'Озвучка ' + (i + 1), index: i });
                            });
                        }
                    }
                    filter_items.voice = voices;

                    showEpisodes(info, item);
                } else if (info.url) {
                    playVideo({ url: info.url, title: item.title }, item);
                } else {
                    Lampa.Noty.show('Невідомий формат');
                }
            }

            function showEpisodes(info, item) {
                var season = info.seasons[choice.season] || info.seasons[0];
                if (!season || !season.episodes) {
                    Lampa.Noty.show('Серії не знайдено');
                    return;
                }

                var episodes = [];
                season.episodes.forEach(function (ep, ei) {
                    var sound = ep.sounds && ep.sounds[choice.voice] ? ep.sounds[choice.voice] : (ep.sounds ? ep.sounds[0] : null);
                    if (sound && sound.url) {
                        episodes.push({
                            title: ep.title || 'Серія ' + (ei + 1),
                            quality: '',
                            info: sound.title || '',
                            season: choice.season + 1,
                            episode: ei + 1,
                            url: sound.url,
                            voice: sound.title
                        });
                    }
                });

                if (episodes.length) {
                    component.reset();
                    component.showResults(episodes, {
                        onSelect: function (a) {
                            playVideo(a, item);
                        }
                    });
                    component.filter(filter_items, choice);
                } else {
                    Lampa.Noty.show('Серії не знайдено');
                }
            }

            function decodeTortugaUrl(encoded) {
                try {
                    var cleaned = encoded.replace(/=+$/, '');
                    var decoded = atob(cleaned);
                    var reversed = decoded.split('').reverse().join('');
                    if (reversed.startsWith('http')) {
                        return reversed;
                    }
                } catch (e) {}
                return null;
            }

            function playVideo(a, item) {
                Lampa.Modal.open({
                    title: '',
                    html: $('<div class="broadcast__text" style="padding:1.5em">Отримання відео...</div>'),
                    onBack: function () {
                        Lampa.Modal.close();
                        Lampa.Controller.toggle('content');
                    }
                });

                var startPlayer = function(videoUrl) {
                    var title_full = select_title;
                    if (a.season) title_full += ' S' + a.season;
                    if (a.episode) title_full += 'E' + a.episode;
                    if (a.voice) title_full += ' (' + a.voice + ')';

                    Lampa.Player.play({
                        title: title_full,
                        url: videoUrl
                    });
                    Lampa.Player.playlist([{
                        title: title_full,
                        url: videoUrl
                    }]);
                };

                if (a.url && a.url.indexOf('.m3u8') !== -1) {
                    Lampa.Modal.close();
                    startPlayer(a.url);
                    return;
                }

                network.clear();
                network.timeout(20000);
                network.silent(proxyUrl(a.url), function (str) {
                    Lampa.Modal.close();

                    var fileMatch = str.match(/file\s*:\s*["']([^"']+)["']/);
                    if (fileMatch && fileMatch[1]) {
                        var url = fileMatch[1];

                        if (!url.startsWith('http')) {
                            url = decodeTortugaUrl(url);
                        }

                        if (url && url.startsWith('http')) {
                            startPlayer(url);
                        } else {
                            Lampa.Noty.show('URL відео невірний');
                            Lampa.Controller.toggle('content');
                        }
                    } else {
                        Lampa.Noty.show('Відео не знайдено');
                        Lampa.Controller.toggle('content');
                    }
                }, function (err) {
                    Lampa.Modal.close();
                    Lampa.Noty.show('Помилка: ' + (err.status || 'невідома'));
                    Lampa.Controller.toggle('content');
                }, false, { dataType: 'text' });
            }

            this.filter = function (type, a) {
                if (type === 'season') {
                    choice.season = a.index;
                    if (player_data && player_data[0]) {
                        showEpisodes(player_data[0], { title: select_title });
                    }
                } else if (type === 'voice') {
                    choice.voice = a.index;
                    choice.voice_name = a.title;
                    if (player_data && player_data[0]) {
                        showEpisodes(player_data[0], { title: select_title });
                    }
                }
            };

            this.reset = function () {
                choice = { season: 0, voice: 0, voice_name: '' };
                player_data = null;
                results_cache = [];
            };

            this.destroy = function () {
                network.clear();
            };
        };
    }

    function component(object) {
        var scroll = new Lampa.Scroll({ mask: true, over: true });
        var files = new Lampa.Explorer(object);
        var filter = new Lampa.Filter(object);
        var sources = { uaserials: createSource() };
        var balanser = 'uaserials';
        var source;
        var last;
        var filter_translate = {
            season: Lampa.Lang.translate('torrent_serial_season'),
            voice: Lampa.Lang.translate('torrent_parser_voice'),
            source: Lampa.Lang.translate('settings_rest_source')
        };

        this.create = function () {
            var _this = this;

            source = new sources[balanser](this, object);

            filter.onSearch = function (value) {
                Lampa.Activity.replace({ search: value, clarification: true });
            };

            filter.onBack = function () {
                _this.start();
            };

            filter.onSelect = function (type, a, b) {
                if (type == 'filter') {
                    source.filter(type, a, b);
                } else if (type == 'sort') {
                    Lampa.Select.close();
                }
            };

            filter.render().find('.filter--sort span').text('Джерело');
            filter.set('sort', [{ title: 'UASerials', source: 'uaserials', selected: true }]);
            filter.chosen('sort', ['UASerials']);

            files.appendFiles(scroll.render());
            files.appendHead(filter.render());
            scroll.body().addClass('torrent-list');
            scroll.minus(files.render().find('.explorer__files-head'));

            this.search();
        };

        this.search = function () {
            this.loading(true);
            this.reset();

            var movie = object.movie;
            var title = movie.title || movie.name;

            if (object.search) title = object.search;

            source.searchByTitle(object, title);
        };

        this.loading = function (status) {
            if (status) this.activity.loader(true);
            else this.activity.loader(false);
        };

        this.reset = function () {
            last = null;
            scroll.clear();
            scroll.body().empty();
        };

        this.emptyForBalanser = function (name) {
            this.loading(false);
            var empty = Lampa.Template.get('list_empty');
            scroll.body().append(empty);
            this.activity.toggle();
        };

        this.showResults = function (items, params) {
            var _this = this;
            scroll.body().empty();

            items.forEach(function (item, index) {
                var elem = $(
                    '<div class="selector torrent-item">' +
                    '<div class="torrent-item__title">' + item.title + '</div>' +
                    (item.info ? '<div class="torrent-item__info">' + item.info + '</div>' : '') +
                    '</div>'
                );

                elem.on('hover:enter', function () {
                    params.onSelect(item);
                });

                scroll.body().append(elem);
                if (index === 0) last = elem;
            });

            this.loading(false);
            this.activity.toggle();
        };

        this.filter = function (filter_items, choice) {
            var items = [];

            if (filter_items.season && filter_items.season.length) {
                items.push({
                    title: filter_translate.season,
                    subtitle: filter_items.season[choice.season].title,
                    items: filter_items.season,
                    stype: 'season'
                });
            }

            if (filter_items.voice && filter_items.voice.length) {
                items.push({
                    title: filter_translate.voice,
                    subtitle: filter_items.voice[choice.voice].title,
                    items: filter_items.voice,
                    stype: 'voice'
                });
            }

            filter.set('filter', items);
            filter.chosen('filter', [
                filter_items.season[choice.season] ? filter_items.season[choice.season].title : '',
                filter_items.voice[choice.voice] ? filter_items.voice[choice.voice].title : ''
            ].filter(Boolean));
        };

        this.start = function () {
            if (Lampa.Activity.active().activity !== this.activity) return;
            if (last) last.trigger('hover:focus');
        };

        this.pause = function () {};
        this.stop = function () {};
        this.render = function () { return files.render(); };
        this.destroy = function () {
            network.clear();
            scroll.destroy();
            if (source) source.destroy();
        };
    }

    function loadCryptoJS(callback) {
        if (window.CryptoJS) {
            callback();
            return;
        }

        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js', function () {
            callback();
        }).fail(function () {
            Lampa.Noty.show('Не вдалося завантажити CryptoJS');
        });
    }

    function startPlugin() {
        if (window.uaserials_plugin_ready) return;
        window.uaserials_plugin_ready = true;

        loadCryptoJS(function () {
            Lampa.Component.add('online_mod_uaserials', component);

            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    var btn = $(
                        '<div class="full-start__button selector view--online_mod_uaserials" data-subtitle="Онлайн">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width:1.3em;height:1.3em">' +
                        '<path d="M8 5v14l11-7z"/>' +
                        '</svg>' +
                        '<span>Дивитись</span>' +
                        '</div>'
                    );

                    btn.on('hover:enter', function () {
                        var movie = e.data.movie;
                        var title = movie.title || movie.name;

                        Lampa.Activity.push({
                            url: '',
                            title: 'Онлайн',
                            component: 'online_mod_uaserials',
                            search: title,
                            search_original: movie.original_title || movie.original_name,
                            movie: movie,
                            page: 1
                        });
                    });

                    var render = e.object.activity.render();
                    var buttonsContainer = render.find('.full-start__buttons');
                    
                    if (buttonsContainer.length) {
                        buttonsContainer.prepend(btn);
                    }
                }
            });

            Lampa.Lang.add({
                torrent_serial_season: {
                    uk: 'Сезон',
                    ru: 'Сезон',
                    en: 'Season'
                },
                torrent_parser_voice: {
                    uk: 'Озвучка',
                    ru: 'Озвучка',
                    en: 'Voice'
                }
            });
        });
    }

    if (window.appready) startPlugin();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') startPlugin();
        });
    }
})();
