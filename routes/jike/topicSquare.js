const axios = require('../../utils/axios');

module.exports = async (ctx) => {
    const id = ctx.params.id;

    const response = await axios({
        method: 'post',
        url: 'https://app.jike.ruguoapp.com/1.0/squarePosts/list',
        headers: {
            Referer: `https://m.okjike.com/topics/${id}`,
            'App-Version': '4.1.0',
        },
        data: {
            loadMoreKey: null,
            topicId: id,
            limit: 20,
        },
    });

    const data = response.data.data;
    const topic = data[0].topic;

    ctx.state.data = {
        title: `${topic.content} - 即刻主题广场`,
        link: `https://web.okjike.com/topic/${id}/user`,
        description: topic.content,
        image: topic.squarePicture.picUrl || topic.squarePicture.middlePicUrl || topic.squarePicture.thumbnailUrl,
        item: data.map((item) => {
            let contentTemplate = item.content;
            if (item.linkInfo && (item.linkInfo.originalLinkUrl || item.linkInfo.linkUrl)) {
                contentTemplate = `<a href="${item.linkInfo.originalLinkUrl || item.linkInfo.linkUrl}">${item.content}</a>`;
            }

            let imgTemplate = '';
            item.pictures &&
                item.pictures.forEach((item) => {
                    imgTemplate += `<br><img referrerpolicy="no-referrer" src="${item.picUrl}">`;
                });

            return {
                title: item.content,
                description: `${item.user.screenName}: ${contentTemplate}${imgTemplate}`,
                pubDate: new Date(item.createdAt).toUTCString(),
                link: `https://web.okjike.com/post-detail/${item.id}/originalPost`,
            };
        }),
    };
};
