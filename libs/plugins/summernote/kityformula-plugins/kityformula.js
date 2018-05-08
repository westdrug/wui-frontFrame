/**
 * Created by westdrug on 2017/11/3.
 */
// 全局接收方法
var INDSERTREADY = function (res) {};
// 加载公式页面地址
var KITYFORMULAlAYER = './libs/plugins/summernote/kityformula-plugins/kityFormulaLayer.html';

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(window.jQuery);
    }
}(function ($) {
    $.extend($.summernote.plugins, {
        'KityFormula': function (context) {
            var self = this;
            var ui = $.summernote.ui;
            var KFIMGSRC = '';         //定义公式base64值
            var range;                 //记录光标位置对象
            
            var creatLayer = function () {
                var _sh= '<div class="layui-layer-shade" id="layui-layer-shade-kityformula" style="z-index:19891015; background-color:#000; opacity:0.3; filter:alpha(opacity=30);display: none"></div>';
                var _kt = '';
                    _kt += '<div class="layui-layer layui-anim layui-layer-iframe layui-layer-demo layer-kityformula" id="layui-layer-kityformula" type="iframe" times="2" showtime="0" contype="string" style="z-index: 19891016; width: 800px; height: 540px; margin: -270px 0 0 -400px;top: 50%;;display: none">';
                    _kt += '<div class="layui-layer-title" style="cursor: move;" move="ok">插入公式-kityFormula</div>';
                    _kt += '<div class="layui-layer-content">';
                    _kt += '<iframe scrolling="auto" allowtransparency="true" id="layui-layer-iframe2" name="layui-layer-iframe2" onload="this.className=\'\';" class="" frameborder="0" src="'+ KITYFORMULAlAYER +'" style="height: 442px;"></iframe>';
                    _kt += '</div>';
                    _kt += '<span class="layui-layer-setwin">';
                    _kt += '<a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"></a>';
                    _kt += '</span>';
                    _kt += '<div class="layui-layer-btn">';
                    _kt += '<a class="layui-layer-btn0">确定</a>';
                    _kt += '<a class="layui-layer-btn1">取消</a>';
                    _kt += '</div>';
                    _kt += '</div>';

                $('body').append(_sh);
                $('body').append(_kt);
            };

            // add KityFormula button
            context.memo('button.KityFormula', function () {

                if(browser.versions.aWebKit || browser.versions.presto || browser.versions.webApp) { creatLayer(); }

                // create button
                var button = ui.button({
                    contents: '<i class="fa fa-slack"/>',
                    tooltip: '插入公式-kityFormula',
                    click: function (e) {
                        if(browser.versions.gecko || browser.versions.trident) { creatLayer();}
                        layer.closeAll(); //关闭所有其它弹出层；
                        // 插入公式前 记录下光标上次的位置，用于校正插入公式的位置错误问题
                        var _node = window.getSelection().anchorNode;
                        var _kityformulaEle = $('#layui-layer-kityformula');
                        var _kityformulaSha = $('#layui-layer-shade-kityformula');
                        var _kitySubmitBtn = $('.layer-kityformula .layui-layer-btn0');
                        // 这里判断是做是否有光标判断
                        if(_node!=null){
                            range = window.getSelection().getRangeAt(0);// 获取光标起始位置
                        }else{
                            range = undefined;
                        };

                        if(_kityformulaEle.is(':hidden')) {
                            _kityformulaSha.show();
                            _kityformulaEle.show();
                            _kitySubmitBtn.attr('style', '').text('确定');

                            //点击确定
                            _kitySubmitBtn
                                .on('click', function () {
                                    window.setTimeout(function () {
                                        _kityformulaSha.hide();
                                        _kityformulaEle.hide();
                                    }, 1500);
                                    $(this).text('生成中...').css({'cursor': 'wait', 'opacity': '.4'});
                                })

                            //点击取消
                            $('.layer-kityformula .layui-layer-btn1,.layer-kityformula .layui-layer-close1')
                                .on('click', function () {
                                    _kityformulaSha.hide();
                                    _kityformulaEle.hide();
                                })
                        }
                    }
                });

                var $kityBtn = button.render();
                return $kityBtn;
            });

            INDSERTREADY = function ( editor ) {
                //点击layer 确定按钮，返回 kityFormula
                $(document).on('click', '.layer-kityformula .layui-layer-btn0', function(){
                    editor.execCommand( "get.image.data", function ( data ) {
                        KFIMGSRC = data.img;
                    });
                });
            };

            var addListener = function (editor) {
                var _wd = context.layoutInfo.editable.selector;
                $(document).on('click', '.layer-kityformula .layui-layer-btn0', function(){
                    var img = new Image();
                    window.setTimeout(function () {
                        img.src = KFIMGSRC;
                        img.className = 'kityformula-img';

                        //range.setStartAfter(document.querySelector(_wd).lastChild);
                        range.setEndAfter(document.querySelector(_wd).lastChild);

                        range.insertNode(img);

                        range.selectNode(document.querySelector(_wd));

                        //context.invoke('editor.insertNode', img);
                    }, 1000)
                });
            };

            // This events will be attached when editor is initialized.
            this.events = {
                // This will be called after modules are initialized.
                'summernote.init': function (we, e) {
                    addListener();
                },
                // This will be called when user releases a key on editable.
                'summernote.keyup': function (we, e) {
                }
            };

            var browser = {
                versions: function() {
                    var u = navigator.userAgent;
                    return {
                        trident: u.indexOf('Trident') > -1, //IE内核
                        presto: u.indexOf('Presto') > -1, //opera内核
                        aWebKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                        gecko: u.indexOf('Firefox') > -1, //火狐内核Gecko
                        webApp: u.indexOf('Safari') > -1 //Safari
                    };
                }()
            }

        }
    });
}));
