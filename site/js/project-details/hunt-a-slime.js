// 이미지와 같은 폴더의 JSON에서 KO / EN / JA 상세 콘텐츠를 읽는다.
(function () {
    window.ProjectDetailConfigs = window.ProjectDetailConfigs || {};

    window.ProjectDetailReady = fetch('assets/www-hunt-a-slime/content.json', { cache: 'no-cache' })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Hunt a Slime 콘텐츠를 불러올 수 없습니다 (' + response.status + ')');
            }
            return response.json();
        })
        .then(function (data) {
            window.ProjectDetailConfigs['hunt-a-slime'] = data.detail;
        });
})();
