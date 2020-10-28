import Post from '../../models/post';
import mongoose from 'mongoose';

export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!mongoose.isValidObjectId(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  return next();
};

/* 포스트 작성
  POST /api/posts
  {
    title: '제목',
    body: '내용',
    tags: ['태그1', '태그2']
  }
 */
export const write = async (ctx) => {
  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 포스트 목록 조회
  GET /api/posts
 */
export const list = async (ctx) => {
  try {
    ctx.body = await Post.find().exec();
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 특정 포스터 조회
  GET /api/posts/:id
 */
export const read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 특정 포스트 제거
  DELETE /api/posts/:id
 */
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 포스트 수정(교체)
  PATCH /api/posts/:id
  {
    title: '수정',
    body: '수정 내용',
    tags: ['수정', '태그']
   }
 */
export const update = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
