const request = require("request");
const fetch = require("node-fetch");
const { convertViToEn, convertViToEnRemoveSpace } = require("../../../utils/utils");
const { postsData } = require("../../../data/facebook");

const ACCESS_TOKEN =
  process.env.ACCESS_TOKEN ||
  "EAAAAZAw4FxQIBAAYOHtt6CcTo3jF1Yzy4cZCw9mfeERl41vDZAk9VupbVVl5ZARmrg9c2CrFIVz58gsFdY4srlbeKsQ5ZAUxiN5LG5GrRhBnPz7KddB9oBL6nO8Iw9i2gospJPAnw6JxXbZAlOCyGaR46MygvCJ3MOi7VpPXx0PZCfIW5d1EZABJ";
const API_LINK = process.env.FBAPI_LINK || "https://graph.facebook.com/v10.0";

const KEYWORDS = ["đi hàng", "chuyển hàng", "shipping", "fba"];

/**
 *
 * @param {[]} groupIds
 * @param {number} limit
 */
const getPosts = (groupIds, limit = 50) => {
  return groupIds.map(
    (groupId) =>
      new Promise((resolve, reject) => {
        let url = `${API_LINK}/${groupId}/feed?fields=comments{comments{comment_count,message,created_time},comment_count,message,created_time},id,link,message,created_time&limit=${limit}&access_token=${ACCESS_TOKEN}`;
        const options = {
          url: url,
          method: "GET",
        };
        request(options, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            resolve(JSON.parse(body)); // -> call get comments
          } else {
            console.log(`Error while getting posts from ${groupId}: `, error.message);
            throw error;
          }
        });
      })
  );
};

const getPosts2 = (groupIds, limit = 10) => {
  return groupIds.map(
    (groupId) =>
      new Promise((resolve, reject) => {
        results = [];
        url = `${API_LINK}/${groupId}/feed?fields=message,link&limit=${limit}&access_token=${ACCESS_TOKEN}`;
        const options = {
          url: url,
          method: "GET",
        };
        request(options, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            resolve(JSON.parse(body)); // -> call get comments
          } else {
            console.log(`Error while getting posts from ${groupId}: `, error.message);
            throw error;
          }
        });
      })
  );
};

const addLabelForPost = (posts, keywords) => {
  console.log(keywords);
  let resp = [];
  posts.forEach((post) => {
    keywords.forEach((keyword) => {
      let enKeyword = convertViToEn(keyword);
      const regex = new RegExp(enKeyword, "gm");
      const [groupId, postId] = post.id.split("_");

      if (!post.message) {
        return;
      }

      if (convertViToEn(post.message).match(regex)) {
        // const user = {
        //   uid: post.from.id,
        //   message: post.message,
        //   label: keyword,
        //   labelEn: convertViToEnRemoveSpace(keyword),
        //   type: "post",
        //   createdTime: post.created_time,
        // };
        // resp.push(user);
      }

      if (post.comments) {
        post.comments.data.forEach((cmt) => {
          if (cmt.message) {
            const message = convertViToEn(cmt.message);
            if (message.match(regex)) {
              const user = {
                uid: cmt.id,
                message: cmt.message,
                label: keyword,
                labelEn: convertViToEnRemoveSpace(keyword),
                type: "comment",
                link: post.link,
                permalink: `https://www.facebook.com/groups/${groupId}/permalink/${postId}`,
                createdTime: cmt.created_time,
              };
              resp.push(user);
            }
          }
          if (cmt.comment_count > 0) {
            cmt.comments.data.forEach((subcmt) => {
              if (subcmt.message) {
                if (convertViToEn(subcmt.message).match(regex)) {
                  const user = {
                    uid: subcmt.id,
                    message: subcmt.message,
                    label: keyword,
                    labelEn: convertViToEnRemoveSpace(keyword),
                    type: "comment",
                    link: post.link,
                    permalink: `https://www.facebook.com/groups/${groupId}/permalink/${postId}`,
                    createdTime: subcmt.created_time,
                  };
                  resp.push(user);
                }
              }
            });
          }
        });
      }
    });
  });
  return resp;
};

const addLabelForPost2 = (posts) => {
  let resp = [];
  posts.forEach((post) => {
    post.label = [];
    post.commentStatistic = {};
    post.commentStatistic.label = {};

    KEYWORDS.forEach((keyword) => {
      let enKeywordRemoveSpace = convertViToEnRemoveSpace(keyword);
      let enKeyword = convertViToEn(keyword);
      const regex = new RegExp(enKeyword, "gm");

      if (regex.test(convertViToEn(post.message))) {
        post.label.push(enKeywordRemoveSpace);
      }

      if (post.comments) {
        post.comments.data.forEach((cmt) => {
          const message = convertViToEn(cmt.message);
          post.commentStatistic.label[enKeywordRemoveSpace] = [];

          if (message.match(regex)) {
            post.commentStatistic.label[enKeywordRemoveSpace].push(cmt.id);
          }
          if (cmt.comment_count > 0) {
            cmt.comments.data.forEach((subcmt) => {
              if (regex.test(convertViToEn(subcmt.message))) {
                post.commentStatistic.label[enKeywordRemoveSpace].push(subcmt.id);
              }
            });
          }
          if (post.commentStatistic.label[enKeywordRemoveSpace].length === 0) {
            delete post.commentStatistic.label[enKeywordRemoveSpace];
          }
        });
      }
    });

    return post;
  });
  return resp;
};

const postWithLabel = [
  {
    message: "Các bác có ai không nhận được OTP Amazon gửi về điện thoại không, vận chuyển hàng hay là chặn rồi.",
    id: "752909951902149_1014267362433072",
    comments: {
      data: [
        {
          message: "Ib b nhé , van chuyen hang list k cần upc",
          comment_count: 8,
          comments: {
            data: [
              { message: " van chuyen hang list  ", id: "1005486013311207" },
              { message: "Trần Hải chỉ mình với đc ko bạn", id: "1005549913304817" },
              { message: "Vũ Đức Hùng ok bác ", id: "1005550359971439" },
              { message: "Trần Hải tks bạn", id: "1005552316637910" },
              {
                message: "Trần Hải Tuyệt vời.  Anh  bạn  Team  thằng  e Nguyễn Hoàng Minh  tuyệt  vời  đó! ",
                id: "1005634936629648",
              },
              { message: "Que Nguyen Xuan đâu có gì đâu a , ", id: "1005684209958054" },
              { message: "Trần Hải ", id: "1005688426624299" },
              { message: "Trần Hải anh check ib e với ạ", id: "1014894995703642" },
            ],
          },
          id: "1005485803311228",
        },
      ],
    },
    label: ["chuyenhang"],
    commentStatistic: { label: { chuyenhang: ["1005485803311228", "1005486013311207"] } },
  },
];

const statisticPost = (posts) => {
  // init data
  let dataStatistic = {};
  KEYWORDS.map((keyword) => (dataStatistic[convertViToEnRemoveSpace(keyword)] = []));

  const keywordMap = new Map(KEYWORDS.map((keyword) => [convertViToEnRemoveSpace(keyword), keyword]));

  posts.forEach((post) => {
    post.label.forEach((label) => {
      if (keywordMap.has(label)) {
        dataStatistic[label].push(post);
      }
    });
  });

  return dataStatistic;
};

// console.log(statisticPost(postWithLabel));

const _getPost = () => {
  _get_posts.then((posts) => {
    console.log(posts);
  });
};
/**
 *
 * @param {[]} postIds
 */
const getComments = (postIds) => {
  return postIds.map(
    (postId) =>
      new Promise((resolve, reject) => {
        results = [];
        url = `${API_LINK}/${postId}/comments?fields=like_count&limit=${limit}&access_token=${ACCESS_TOKEN}`;
        const options = {
          url: url,
          method: "GET",
        };
        request(options, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            resolve(JSON.parse(body)); // -> call get comments
          } else {
            console.log(`Error while getting posts from ${postId}: `, error.message);
            throw error;
          }
        });
      })
  );
};

export default async function faceBookHandler(req, res) {
  const respGetPost = await Promise.all(getPosts(["752909951902149"]));

  const listUser = [];
  respGetPost.forEach(({ data }) => {
    listUser.push(...data);
  });

  let { keywords } = req.query;
  if (!keywords || !Array.isArray(keywords)) {
    req.query.keywords = (keywords || "").split(/\s*(?:,|$)\s*/).filter((e) => e !== "");
  }

  if (req.query.keywords.length === 0) {
    req.query.keywords = KEYWORDS;
  }

  const result = addLabelForPost(listUser, req.query.keywords);
  res.status(200).json(result);
  //   res.status(200).json(listUser);
}
