module.exports = (docs, uid) => {
  console.log("=====docs===============================");
  console.log(docs);
  console.log("====================================");
  console.log("====================================");
  console.log(uid);
  console.log("====================================");
  const newDocs = docs.map(function (doc) {
    let nd;
    if (doc.likes.length === 0) {
      nd = { doc, ...{ liked: false } };
    } else {
      doc.likes.map((like) => {
        console.log("===============tyoeof=====================");
        console.log(typeof JSON.stringify(like), typeof uid);
        console.log("====================================");
        console.log(typeof JSON.stringify(like) === uid);
        console.log("====================================");
        console.log("====================================");
        console.log(uid, like);
        console.log("====================================");
        console.log("====================================");
        nd = {
          doc,
          ...{ liked: JSON.stringify(like) === uid ? true : false },
        };
      });
    }
    return nd;
  });
  return newDocs;
};
