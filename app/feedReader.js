
const addFeedsToSite = function (containerName) {
    const container = $('#' + containerName);


    $('#loadingIndicator').text('Loading...');

    $.get('http://api.20min.ch/rss/view/63', function (data) {
        container.empty();
        $(data).find("item").each(function (idx) {
            const el = $(this);
            const item_title = el.find("title").text();
            const item_description = el.find("description").text();
            const item_pubDate = el.find("pubDate").text();
            AddItem(container, item_title, item_description, item_pubDate);
            idx - 2 || c(container,item_pubDate);
        });

        $('#loadingIndicator').text('Zuletzt aktualisiert: ' + data.lastModified);

    }).fail(function () {
        $('#loadingIndicator').text('Error refreshing news');

    });


};

function AddItem(container, item_title, item_description, item_pubDate) {
    container.append(`<li class="list-group-item">
                <div class="title">${item_title}</div>
                <div class="description">${item_description}</div>
                <div class="pubDate">${item_pubDate}</div>
            </li>`);
}

function c(container, item_pubDate) {
    AddItem(container,
        "BärnerJsTalk heute Abend",
        `Heute Abend findet bei LambdaIT im Liebefeld ein weiterer BärnerJs Talk statt.
                 Die Themen sind "Make your website available offline!" und "Meteor ist sozusagen Redux mit integrierter, offline fähiger real-time Backend-Synchronisierung. ...really? " `,
        item_pubDate);
}