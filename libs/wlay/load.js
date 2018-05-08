var loadEle = {}
    loadEle.fn = {
        init: function(args){
            this.callback = args.callback
            this.start()
        },
        start: function() {
            var that = this,
                mnav = '.menu-link',
                mwrap = $('#main-wrap')
            var date = new Date()
            $(mnav).on('click', function() {
                var _t = $(this),
                    _url = 'page/' + _t.data('id') + '.html'

                $(mnav).removeClass('active')
                _t.addClass('active')
                that.pLoad(mwrap, _url)
                mwrap.css('background-color', '#fff')
            }).eq(0).click()
        },
        pLoad: function(ele, url) {
            var that = this
            ele.load(url, function(responseTxt,statusTxt,xhr) {
                if(statusTxt == 'success') {
                    if($.isFunction(that.callback)) that.callback()
                } else if(statusTxt == 'error') {
                    alert("Error: "+xhr.status+": "+xhr.statusText);
                }
            })
        }
    }