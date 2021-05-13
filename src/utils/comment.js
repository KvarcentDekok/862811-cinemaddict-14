export const createComment = (commentData) => {
  return {
    emotion: commentData.get('comment-emoji'),
    comment: commentData.get('comment'),
  };
};
