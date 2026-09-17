(function () {
    window.ProjectDetailConfigs = window.ProjectDetailConfigs || {};

    window.ProjectDetailReady = fetch('assets/forestworkshop/content.json')
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Failed to load forest-workshop content (' + response.status + ')');
            }
            return response.json();
        })
        .then(function (data) {
            window.ProjectDetailConfigs['forest-workshop'] = data;
        });
})();
