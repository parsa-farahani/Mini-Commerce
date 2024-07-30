const fs = require('fs');

let WHOLE_COMMENTS = [];

let pc1 = new ProductComments("000001");
pc1.addComment(new Comment("1645654"));

WHOLE_COMMENTS.push(pc1, pc2, pc3);

const jsonData = JSON.stringify(WHOLE_COMMENTS, null, 2); // The third argument (2) specifies indentation

fs.writeFileSync('./comments-data.json', jsonData, 'utf-8');

class ProductComments {
   constructor(productId) {
      this.product_id = productId;
      this.comments = [];
   }

   addComment(comment) {
      this.comments.push(comment);
   }
}

class Comment {
   constructor(value) {
      this.user_id = "0000001";
      this.value = value;
      this.replies = [];
   }

   deny() {

   }
   accept() {

   }
   delete() {

   }
   addReply(replyComment) {  // ReplyComment is a 'Comment' object itself.
      this.replies.push(replyComment);
   }
}