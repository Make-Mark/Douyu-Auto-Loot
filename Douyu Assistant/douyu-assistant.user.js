// ==UserScript==
// @name         斗鱼助手
// @namespace    https://github.com/Make-Mark/UserScripts/
// @version      0.4.1
// @description  自动领取鱼丸（需要手动输入验证码）、自动打开宝箱
// @author       Make-Mark
// @include      /^https?:\/\/(www|yuxiu)\.douyu\.com\/(t\/)?\w+$/
// @resource     css https://raw.githubusercontent.com/Make-Mark/UserScripts/master/Douyu%20Assistant/douyu-assistant.css
// @resource     html https://raw.githubusercontent.com/Make-Mark/UserScripts/master/Douyu%20Assistant/douyu-assistant.html
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

let chestId = null;
let yuwanId = null;
var ttscrc = '"http://tts.baidu.com/text2audio?idx=1&tex=' + document.title.substring(0,5) + '&cuid=baidu_speech_demo&cod=2&lan=zh&ctp=1&pdt=1&spd=5&vol=5&pit=5&per=3"';
$( "body" ).append("<audio id='audioPlay' src=" + ttscrc + " type='audio/mpeg'> hidden='true'>" );
var audio = document.getElementById( "audioPlay" );

(() => {
    'use strict';
    GM_addStyle(GM_getResourceText('css'));
    $('div#js-stats-and-actions > div:nth-child(3)').after(GM_getResourceText('html'));
    const getYuwan = () => {
        const time = $('span.getyw-time').text();
        const wait = () => {
            if ($('div.aui_content').text()) {
                $('button.aui_state_highlight').click();
                $('input#yuwan-switch').click();
            } else if ($('div.geetest_wait').length) {
                $('div.geetest_btn')
                    .mouseenter()
                    .click();
                getYuwan();
            } else {
                setTimeout(wait, 100);
            }
        };
        switch (time) {
            case '领取':
                if ($('div.v3-sign-wrap:visible').length) {
                    break;
                }
                $('a.may-btn')
                    .mouseenter()
                    .click();
                setTimeout(wait, 100);
                return;
            case '完成':
                return;
            case '':
                break;
            default:
                const [minute, second] = time.split(':');
                const ms = (Number(minute) * 60 + Number(second)) * 1000;
                yuwanId = setTimeout(getYuwan, ms);
                return;
        }
        yuwanId = setTimeout(getYuwan, 1000);
    };

    clickChest();
    $('input#chest-switch').change((e) => {
        e.currentTarget.checked
            ? clickChest()
            : clearInterval(chestId);
    });
    $('input#chest-switch').prop("checked",true);
    $('input#yuwan-switch').change(
        (e) => (e.currentTarget.checked ? getYuwan() : clearTimeout(yuwanId))
    );
})();

function clickChest(){
    chestId = setInterval(() => {
        if ($('div.geetest_fullpage_click_box:visible').length) {
            return;
        }
        const peck = $('div.peck-cdn');
        peck.length && '领取' === peck.text() && peck.mouseenter().click();
            if (document.getElementsByClassName("peck-cdn")[0].innerHTML == "00:05" || document.getElementsByClassName("peck-cdn")[0].innerHTML == "领取"){
                audio.play();
            }
        }, 100)
}