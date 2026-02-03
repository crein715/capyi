(function () {
    'use strict';

    var UASerials = {
        name: 'UASerials',
        version: '1.0.0',
        url: 'https://uaserials.com',
        network: new Lampa.Reguest(),
        AES_KEY: '297796CCB81D2551',
        
        categories: {
            'series': '/series/',
            'cartoons': '/cartoons/',
            'fcartoon': '/fcartoon/',
            'anime': '/anime/',
            'films': '/films/'
        },

        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7'
        },

        parseHTML: function(html) {
            var parser = new DOMParser();
            return parser.parseFromString(html, 'text/html');
        },

        fixUrl: function(url) {
            if (!url) return '';
            if (url.startsWith('//')) return 'https:' + url;
            if (url.startsWith('/')) return this.url + url;
            if (!url.startsWith('http')) return this.url + '/' + url;
            return url;
        },

        hexToBytes: function(hex) {
            var bytes = [];
            for (var i = 0; i < hex.length; i += 2) {
                bytes.push(parseInt(hex.substr(i, 2), 16));
            }
            return new Uint8Array(bytes);
        },

        decryptAES: function(data, callback, error) {
            try {
                var salt = this.hexToBytes(data.salt);
                var iv = this.hexToBytes(data.iv);
                var ciphertext = Uint8Array.from(atob(data.ciphertext), c => c.charCodeAt(0));
                var password = this.AES_KEY;
                var iterations = data.iterations || 999;
                
                var encoder = new TextEncoder();
                var keyMaterial = encoder.encode(password);
                
                crypto.subtle.importKey('raw', keyMaterial, 'PBKDF2', false, ['deriveBits', 'deriveKey'])
                    .then(function(baseKey) {
                        return crypto.subtle.deriveKey(
                            {
                                name: 'PBKDF2',
                                salt: salt,
                                iterations: iterations,
                                hash: 'SHA-512'
                            },
                            baseKey,
                            { name: 'AES-CBC', length: 256 },
                            false,
                            ['decrypt']
                        );
                    })
                    .then(function(key) {
                        return crypto.subtle.decrypt({ name: 'AES-CBC', iv: iv }, key, ciphertext);
                    })
                    .then(function(decrypted) {
                        var decoder = new TextDecoder();
                        var result = decoder.decode(decrypted);
                        result = result.replace(/\0+$/, '').trim();
                        if (result.endsWith(']')) {
                            callback(result);
                        } else {
                            var lastBracket = result.lastIndexOf(']');
                            if (lastBracket > 0) {
                                callback(result.substring(0, lastBracket + 1));
                            } else {
                                error('Invalid decrypted data');
                            }
                        }
                    })
                    .catch(function(e) {
                        console.error('AES decrypt error:', e);
                        error(e);
                    });
            } catch (e) {
                console.error('Decrypt error:', e);
                error(e);
            }
        },

        decodeAndReverse: function(encoded) {
            if (!encoded) return null;
            try {
                var decoded = atob(encoded.replace(/=+$/, ''));
                return decoded.split('').reverse().join('');
            } catch (e) {
                try {
                    var padded = encoded;
                    while (padded.length % 4 !== 0) padded += '=';
                    var decoded = atob(padded);
                    return decoded.split('').reverse().join('');
                } catch (e2) {
                    return null;
                }
            }
        },

        search: function(query, callback, error) {
            var self = this;
            
            this.network.clear();
            this.network.silent(this.url, function(html) {
                var doc = self.parseHTML(html);
                var items = doc.querySelectorAll('.short-item');
                var results = [];
                
                items.forEach(function(item) {
                    var titleEl = item.querySelector('div.th-title.truncate');
                    var engTitleEl = item.querySelector('div.th-title-oname.truncate');
                    var linkEl = item.querySelector('.short-item.width-16 .short-img, a.short-img');
                    var imgEl = item.querySelector('.img-fit img');
                    
                    if (!linkEl) linkEl = item.querySelector('a');
                    
                    var link = linkEl ? linkEl.getAttribute('href') : '';
                    var poster = imgEl ? (imgEl.getAttribute('data-src') || imgEl.getAttribute('src')) : '';
                    
                    if (link) {
                        results.push({
                            title: titleEl ? titleEl.textContent.trim() : '',
                            title_en: engTitleEl ? engTitleEl.textContent.trim() : '',
                            url: self.fixUrl(link),
                            poster: self.fixUrl(poster)
                        });
                    }
                });
                
                callback(results);
            }, error, false, {
                dataType: 'text',
                type: 'POST',
                data: {
                    do: 'search',
                    subaction: 'search',
                    story: query
                },
                headers: self.headers
            });
        },

        getMainPage: function(category, page, callback, error) {
            var self = this;
            var categoryPath = this.categories[category] || this.categories['series'];
            var url = this.url + categoryPath + 'page/' + page;
            
            this.network.clear();
            this.network.silent(url, function(html) {
                var doc = self.parseHTML(html);
                var items = doc.querySelectorAll('.short-item');
                var results = [];
                
                items.forEach(function(item) {
                    var titleEl = item.querySelector('div.th-title.truncate');
                    var engTitleEl = item.querySelector('div.th-title-oname.truncate');
                    var linkEl = item.querySelector('a.short-img, a');
                    var imgEl = item.querySelector('.img-fit img');
                    
                    var link = linkEl ? linkEl.getAttribute('href') : '';
                    var poster = imgEl ? (imgEl.getAttribute('data-src') || imgEl.getAttribute('src')) : '';
                    
                    if (link) {
                        results.push({
                            title: titleEl ? titleEl.textContent.trim() : '',
                            title_en: engTitleEl ? engTitleEl.textContent.trim() : '',
                            url: self.fixUrl(link),
                            poster: self.fixUrl(poster)
                        });
                    }
                });
                
                callback(results);
            }, error, false, {
                dataType: 'text',
                headers: self.headers
            });
        },

        getDetails: function(url, callback, error) {
            var self = this;
            
            this.network.clear();
            this.network.silent(url, function(html) {
                var doc = self.parseHTML(html);
                var details = {
                    title: '',
                    title_en: '',
                    poster: '',
                    description: '',
                    year: 0,
                    genres: [],
                    rating: 0,
                    encryptedData: null
                };
                
                var titleEl = doc.querySelector('span.oname_ua');
                var engTitleEl = doc.querySelector('.pmovie__original-title');
                var posterEl = doc.querySelector('div.fimg.img-wide img');
                var descEl = doc.querySelector('.full-text');
                var ratingEl = doc.querySelector('.short-rate-in');
                var playerControl = doc.querySelector('div.fplayer player-control');
                
                details.title = titleEl ? titleEl.textContent.trim() : '';
                details.title_en = engTitleEl ? engTitleEl.textContent.trim() : '';
                details.poster = posterEl ? self.fixUrl(posterEl.getAttribute('src')) : '';
                details.description = descEl ? descEl.textContent.trim() : '';
                details.rating = ratingEl ? parseFloat(ratingEl.textContent) || 0 : 0;
                
                var yearEl = doc.querySelector('a[href*="/year/"]');
                if (yearEl) {
                    var yearMatch = yearEl.textContent.match(/(\d{4})/);
                    details.year = yearMatch ? parseInt(yearMatch[1]) : 0;
                }
                
                doc.querySelectorAll('.short-list li').forEach(function(li) {
                    var span = li.querySelector('span');
                    if (span && span.textContent.includes('Жанр:')) {
                        li.querySelectorAll('a').forEach(function(a) {
                            details.genres.push(a.textContent.trim());
                        });
                    }
                });
                
                if (playerControl) {
                    var dataTag = playerControl.getAttribute('data-tag1');
                    if (dataTag) {
                        try {
                            details.encryptedData = JSON.parse(dataTag);
                        } catch (e) {
                            console.error('Failed to parse player data:', e);
                        }
                    }
                }
                
                callback(details);
            }, error, false, {
                dataType: 'text',
                headers: self.headers
            });
        },

        extractStream: function(playerUrl, callback, error) {
            var self = this;
            
            this.network.clear();
            this.network.silent(playerUrl, function(html) {
                var fileMatch = html.match(/file\s*:\s*["']([^"',]+?)["']/);
                var subsMatch = html.match(/subtitle\s*:\s*["']([^"',]+?)["']/);
                
                var result = {
                    file: null,
                    subtitle: null
                };
                
                if (fileMatch && fileMatch[1]) {
                    var fileUrl = fileMatch[1];
                    if (!fileUrl.startsWith('http')) {
                        fileUrl = self.decodeAndReverse(fileUrl);
                    }
                    result.file = fileUrl;
                }
                
                if (subsMatch && subsMatch[1]) {
                    var subUrl = self.decodeAndReverse(subsMatch[1]);
                    result.subtitle = subUrl;
                }
                
                if (result.file) {
                    callback(result);
                } else {
                    error('No stream found');
                }
            }, error, false, {
                dataType: 'text',
                headers: Object.assign({}, self.headers, {
                    'Referer': self.url
                })
            });
        }
    };

    function component(object) {
        var network = new Lampa.Reguest();
        var scroll = new Lampa.Scroll({ mask: true, over: true });
        var files = new Lampa.Explorer(object);
        var filter = new Lampa.Filter(object);
        
        var loaded = {};
        var playerData = null;
        var filter_items = {
            voice: []
        };
        var choice = {
            season: 0,
            voice: 0,
            voice_name: ''
        };
        
        this.create = function() {
            var _this = this;
            
            this.activity.loader(true);
            
            filter.onSelect = function(type, a, b) {
                choice[a.stype] = b.index;
                if (a.stype === 'voice') choice.voice_name = filter_items.voice[b.index] || '';
                _this.reset();
                _this.showEpisodes();
                setTimeout(function() {
                    _this.activity.toggle();
                }, 300);
            };
            
            filter.render().find('.filter--sort').remove();
            
            scroll.minus(files.render().find('.explorer__files-head'));
            scroll.body().append(files.render());
            
            this.loadDetails();
        };
        
        this.loadDetails = function() {
            var _this = this;
            var movie = object.movie;
            var url = movie.url || '';
            
            UASerials.getDetails(url, function(details) {
                loaded.details = details;
                
                if (details.encryptedData) {
                    _this.decryptPlayerData(details.encryptedData);
                } else {
                    _this.empty('Плеєр не знайдено');
                }
            }, function() {
                _this.empty(Lampa.Lang.translate('torrent_parser_no_data'));
            });
        };
        
        this.decryptPlayerData = function(encrypted) {
            var _this = this;
            
            UASerials.decryptAES(encrypted, function(decrypted) {
                try {
                    decrypted = decrypted.replace(/\\/g, '');
                    playerData = JSON.parse(decrypted);
                    _this.processPlayerData();
                } catch (e) {
                    console.error('Failed to parse decrypted data:', e);
                    _this.empty('Помилка розшифрування');
                }
            }, function(e) {
                console.error('Decrypt failed:', e);
                _this.empty('Помилка розшифрування даних');
            });
        };
        
        this.processPlayerData = function() {
            if (!playerData || !playerData.length) {
                this.empty('Немає даних плеєра');
                return;
            }
            
            var data = playerData[0];
            
            if (data.seasons && data.seasons.length > 0) {
                loaded.isSeries = true;
                loaded.seasons = data.seasons;
                this.buildSeriesFilter();
            } else if (data.url) {
                loaded.isSeries = false;
                loaded.movieUrl = data.url;
                this.playMovie();
            } else {
                this.empty('Невідомий формат даних');
            }
        };
        
        this.buildSeriesFilter = function() {
            var seasons = loaded.seasons;
            var seasonNames = seasons.map(function(s, i) {
                return s.title || ('Сезон ' + (i + 1));
            });
            
            filter.set('season', seasonNames.map(function(name) {
                return { title: name };
            }));
            filter.select('season', choice.season);
            
            this.activity.loader(false);
            this.showEpisodes();
        };
        
        this.showEpisodes = function() {
            var _this = this;
            
            if (!loaded.seasons || !loaded.seasons[choice.season]) {
                this.empty('Сезон не знайдено');
                return;
            }
            
            var season = loaded.seasons[choice.season];
            var episodes = season.episodes || [];
            
            files.clear();
            
            episodes.forEach(function(ep, index) {
                var title = ep.title || ('Серія ' + (index + 1));
                
                var element = Lampa.Template.get('online_file', {
                    title: title,
                    quality: ''
                });
                
                element.on('hover:enter', function() {
                    _this.selectVoice(ep);
                });
                
                files.append(element);
            });
            
            this.activity.toggle();
        };
        
        this.selectVoice = function(episode) {
            var _this = this;
            var sounds = episode.sounds || [];
            
            if (sounds.length === 0) {
                Lampa.Noty.show('Озвучки не знайдено');
                return;
            }
            
            if (sounds.length === 1) {
                this.playEpisode(sounds[0]);
                return;
            }
            
            var items = sounds.map(function(s) {
                return {
                    title: s.title || 'Озвучка',
                    url: s.url
                };
            });
            
            Lampa.Select.show({
                title: 'Оберіть озвучку',
                items: items,
                onSelect: function(item) {
                    _this.playEpisode(item);
                },
                onBack: function() {
                    Lampa.Controller.toggle('content');
                }
            });
        };
        
        this.playEpisode = function(sound) {
            var _this = this;
            var url = sound.url;
            
            this.activity.loader(true);
            
            UASerials.extractStream(url, function(stream) {
                _this.activity.loader(false);
                _this.startPlayback(stream, sound.title || 'Озвучка');
            }, function() {
                _this.activity.loader(false);
                Lampa.Noty.show('Не вдалося отримати відео');
            });
        };
        
        this.playMovie = function() {
            var _this = this;
            var url = loaded.movieUrl;
            
            UASerials.extractStream(url, function(stream) {
                _this.activity.loader(false);
                _this.startPlayback(stream, loaded.details.title);
            }, function() {
                _this.activity.loader(false);
                _this.empty('Не вдалося отримати відео');
            });
        };
        
        this.startPlayback = function(stream, title) {
            var movie = object.movie;
            
            var subtitles = [];
            if (stream.subtitle) {
                var match = stream.subtitle.match(/\[([^\]]+)\](.+)/);
                if (match) {
                    subtitles.push({
                        label: match[1],
                        url: match[2].trim()
                    });
                } else {
                    subtitles.push({
                        label: 'Субтитри',
                        url: stream.subtitle
                    });
                }
            }
            
            var playlist = [{
                title: movie.title + (title ? ' - ' + title : ''),
                url: stream.file,
                quality: {},
                subtitles: subtitles
            }];
            
            Lampa.Player.play(playlist[0]);
            Lampa.Player.playlist(playlist);
        };
        
        this.empty = function(msg) {
            var empty = Lampa.Template.get('list_empty');
            empty.find('.empty__title').text(msg || Lampa.Lang.translate('empty_title'));
            files.append(empty);
            this.activity.loader(false);
            this.activity.toggle();
        };
        
        this.reset = function() {
            files.clear();
        };
        
        this.start = function() {
            if (Lampa.Activity.active().activity !== this.activity) return;
            this.activity.toggle();
        };
        
        this.pause = function() {};
        this.stop = function() {};
        
        this.render = function() {
            return scroll.render();
        };
        
        this.destroy = function() {
            network.clear();
            scroll.destroy();
            files.destroy();
            filter.destroy();
            loaded = {};
            playerData = null;
        };
    }

    function searchComponent(object) {
        var network = new Lampa.Reguest();
        var scroll = new Lampa.Scroll({ mask: true, over: true });
        var html = $('<div class="category-full"></div>');
        var head = $('<div class="category-full__head"><div class="category-full__title">' + Lampa.Lang.translate('search') + ': ' + object.search + '</div></div>');
        var body = $('<div class="category-full__body"></div>');
        var items = [];
        
        html.append(head);
        html.append(body);
        scroll.body().append(html);
        
        this.create = function() {
            var _this = this;
            this.activity.loader(true);
            
            UASerials.search(object.search, function(results) {
                items = results;
                _this.buildResults(results);
            }, function() {
                if (object.search_original && object.search_original !== object.search) {
                    UASerials.search(object.search_original, function(results) {
                        items = results;
                        _this.buildResults(results);
                    }, function() {
                        _this.empty();
                    });
                } else {
                    _this.empty();
                }
            });
        };
        
        this.buildResults = function(results) {
            var _this = this;
            body.empty();
            
            if (results.length === 0) {
                this.empty();
                return;
            }
            
            results.forEach(function(item) {
                var card = Lampa.Template.get('card', {
                    title: item.title,
                    release_year: ''
                });
                
                var img = card.find('.card__img')[0];
                if (img && item.poster) {
                    img.src = item.poster;
                    img.onerror = function() {
                        this.src = './img/img_broken.svg';
                    };
                }
                
                card.addClass('selector');
                
                card.on('hover:enter', function() {
                    _this.openItem(item);
                });
                
                body.append(card);
            });
            
            this.activity.loader(false);
            this.activity.toggle();
        };
        
        this.openItem = function(item) {
            Lampa.Activity.push({
                url: '',
                title: item.title,
                component: 'uaserials',
                movie: {
                    title: item.title,
                    original_title: item.title_en,
                    url: item.url,
                    poster: item.poster
                },
                page: 1
            });
        };
        
        this.empty = function() {
            var empty = Lampa.Template.get('list_empty');
            body.append(empty);
            this.activity.loader(false);
            this.activity.toggle();
        };
        
        this.start = function() {
            if (Lampa.Activity.active().activity !== this.activity) return;
            this.activity.toggle();
        };
        
        this.pause = function() {};
        this.stop = function() {};
        
        this.render = function() {
            return scroll.render();
        };
        
        this.destroy = function() {
            network.clear();
            scroll.destroy();
            items = [];
        };
    }

    function startPlugin() {
        if (window.uaserials_plugin_loaded) return;
        window.uaserials_plugin_loaded = true;
        
        Lampa.Component.add('uaserials', component);
        Lampa.Component.add('uaserials_search', searchComponent);
        
        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'complite') {
                var btn = $('<div class="full-start__button selector view--uaserials" data-subtitle="UASerials">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">' +
                    '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v12h16V6H4zm2 2h2v2H6V8zm4 0h8v2h-8V8zm-4 4h2v2H6v-2zm4 0h8v2h-8v-2z"/>' +
                    '</svg>' +
                    '<span>UASerials</span>' +
                    '</div>');
                
                btn.on('hover:enter', function() {
                    searchMovie(e.data.movie);
                });
                
                e.object.activity.render().find('.view--torrent').after(btn);
            }
        });
        
        function searchMovie(movie) {
            var title = movie.title || movie.name;
            var originalTitle = movie.original_title || movie.original_name;
            
            Lampa.Activity.push({
                url: '',
                title: 'UASerials',
                component: 'uaserials_search',
                search: title,
                search_original: originalTitle,
                movie: {
                    title: title,
                    original_title: originalTitle,
                    poster: movie.poster
                },
                page: 1
            });
        }
        
        console.log('UASerials plugin loaded, version ' + UASerials.version);
    }
    
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                startPlugin();
            }
        });
    }
})();
